/*
 * Copyright © 2020 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 */
import cli from 'cli-ux';
import { getAPIClient } from '../client';
import { NETWORK_CONSTANT } from '../constants';

let tokenIDKly: string;
let prevSnapshotBlockHeight: number;
let additionalAccounts: { address: Buffer; balance: bigint }[];

interface ObserveParams {
	readonly label: string;
	readonly height: number;
	readonly liskCoreV4DataPath: string;
	readonly delay: number;
	readonly isFinal: boolean;
}

export const getTokenIDKly = () => tokenIDKly;

export const getAdditionalAccounts = () => additionalAccounts ?? [];

export const setTokenIDKlyByNetID = (chainID: string) => {
	tokenIDKly = NETWORK_CONSTANT[chainID].tokenID;
};

export const setAdditionalAccountsByChainID = (chainID: string) => {
	additionalAccounts = NETWORK_CONSTANT[chainID].additionalAccounts;
};

export const getPrevSnapshotBlockHeight = () => prevSnapshotBlockHeight;

export const setPrevSnapshotBlockHeightByNetID = (chainID: string) => {
	prevSnapshotBlockHeight = NETWORK_CONSTANT[chainID].prevSnapshotBlockHeight;
};

export const getNodeInfo = async (
	liskCorePath: string,
): Promise<{ height: number; finalizedHeight: number }> => {
	const client = await getAPIClient(liskCorePath);
	const { height, finalizedHeight } = await client.node.getNodeInfo();
	return { height, finalizedHeight };
};

const secondsToHumanString = (seconds: number): string => {
	const years = Math.floor(seconds / 31536000);
	const days = Math.floor((seconds % 31536000) / 86400);
	const hours = Math.floor(((seconds % 31536000) % 86400) / 3600);
	const minutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
	const numSeconds = (((seconds % 31536000) % 86400) % 3600) % 60;

	const result = [];

	if (years > 0) {
		result.push(`${years}y`);
	}

	if (days > 0) {
		result.push(`${days}d`);
	}

	if (hours > 0) {
		result.push(`${hours}h`);
	}

	if (minutes > 0) {
		result.push(`${minutes}m`);
	}

	if (numSeconds > 0) {
		result.push(`${numSeconds}s`);
	}

	if (result.length === 0) {
		return '0';
	}

	return result.join(' ');
};

const getRemainingTime = (currentHeight: number, observedHeight: number): string =>
	secondsToHumanString((observedHeight - currentHeight) * 10);

export const observeChainHeight = async (options: ObserveParams): Promise<number> => {
	const observedHeight = options.height;
	const startHeight = options.isFinal
		? (await getNodeInfo(options.liskCoreV4DataPath)).finalizedHeight
		: (await getNodeInfo(options.liskCoreV4DataPath)).height;

	if (startHeight >= observedHeight) {
		return startHeight;
	}

	const observedProperty = options.isFinal ? 'Finalized height' : 'Height';
	const progress = cli.progress({
		format: `${options.label}: [{bar}] {percentage}% | Remaining: {remaining}/{total} | ${observedProperty}: {height}/${observedHeight} | ETA: {timeLeft}`,
		fps: 2,
		synchronousUpdate: false,
		etaAsynchronousUpdate: false,
		barsize: 30,
	});

	progress.start(observedHeight - startHeight, 0, {
		timeLeft: getRemainingTime(startHeight, observedHeight),
		remaining: observedHeight - startHeight,
		height: startHeight,
	});

	await new Promise((resolve, reject) => {
		let intervalId: NodeJS.Timer;

		// eslint-disable-next-line consistent-return
		const checkHeight = async () => {
			let height!: number;
			try {
				height = options.isFinal
					? (await getNodeInfo(options.liskCoreV4DataPath)).finalizedHeight
					: (await getNodeInfo(options.liskCoreV4DataPath)).height;
			} catch (error) {
				return reject(error);
			}

			progress.update(height - startHeight, {
				timeLeft: getRemainingTime(height, observedHeight),
				remaining: observedHeight - height,
				height,
			});

			if (height >= observedHeight) {
				clearInterval(intervalId);
				return resolve(height);
			}
		};

		intervalId = setInterval(checkHeight, options.delay);
	});

	progress.stop();

	return observedHeight;
};
