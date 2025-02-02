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
import * as crypto from 'crypto';
import * as fs from 'fs-extra';
import path from 'path';
import { Command } from '@oclif/command';

import { BlockHeader } from '@liskhq/lisk-chain';
import { ERROR_CODE, FILE_NAME, SNAPSHOT_TIME_GAP } from '../constants';
import { GenesisAssetEntry } from '../types';
import { execAsync } from './process';
import { copyFile, createTarball } from './fs';
import { MigratorException } from './exception';

/* eslint-disable func-names, @typescript-eslint/no-explicit-any */
(BigInt.prototype as any).toJSON = function () {
	return this.toString();
};
(Buffer.prototype as any).toJSON = function () {
	return this.toString('hex');
};
/* eslint-enable func-names, @typescript-eslint/no-explicit-any */

let genesisBlockCreateCommand: string;

export const getGenesisBlockCreateCommand = () => genesisBlockCreateCommand;

export const createChecksum = async (filePath: string): Promise<string> => {
	const fileStream = fs.createReadStream(filePath);
	const dataHash = crypto.createHash('sha256');
	const fileHash = await new Promise<Buffer>((resolve, reject) => {
		fileStream.on('data', (datum: Buffer) => {
			dataHash.update(datum);
		});
		fileStream.on('error', error => {
			reject(error);
		});
		fileStream.on('end', () => {
			resolve(dataHash.digest());
		});
	});

	return fileHash.toString('hex');
};

export const createGenesisBlock = async (
	_this: Command,
	network: string,
	configFilepath: string,
	outputDir: string,
	blockHeaderAtSnapshotHeight: BlockHeader,
) => {
	try {
		const height = blockHeaderAtSnapshotHeight.height + 1;
		const timestamp = blockHeaderAtSnapshotHeight.timestamp + SNAPSHOT_TIME_GAP;
		const previousBlockID = blockHeaderAtSnapshotHeight.id.toString('hex');

		genesisBlockCreateCommand = `klayr-core genesis-block:create --network ${network} --config=${configFilepath} --output=${outputDir} --assets-file=${outputDir}/genesis_assets.json --height=${height} --previous-block-id=${previousBlockID} --timestamp=${timestamp} --export-json`;
		_this.log(
			`\nExecuting the following command to generate the genesis block:\n${genesisBlockCreateCommand}`,
		);

		await execAsync(genesisBlockCreateCommand);
	} catch (error) {
		throw new MigratorException(
			`Failed to create genesis block.\nError: ${(error as Error).message}`,
			ERROR_CODE.GENESIS_BLOCK_CREATE,
		);
	}
};

export const writeGenesisAssets = async (
	genesisAssets: GenesisAssetEntry[],
	outputDir: string,
): Promise<void> => {
	const genesisAssetsJsonFilepath = path.resolve(outputDir, FILE_NAME.GENESIS_ASSETS);
	fs.writeFileSync(
		genesisAssetsJsonFilepath,
		JSON.stringify({ assets: genesisAssets }, null, '\t'),
	);
};

export const copyGenesisBlock = async (
	currGenesisBlockFilepath: string,
	liskCoreV4ConfigPath: string,
): Promise<boolean | Error> => copyFile(currGenesisBlockFilepath, liskCoreV4ConfigPath);

export const writeGenesisBlock = async (outputDir: string): Promise<void> => {
	// Genesis BLOB handling
	const genesisBlockBlobFilepath = path.resolve(outputDir, FILE_NAME.GENESIS_BLOCK_BLOB);

	const genesisBlockBlobHash = await createChecksum(genesisBlockBlobFilepath);
	fs.writeFileSync(
		path.resolve(outputDir, `${FILE_NAME.GENESIS_BLOCK_BLOB}.SHA256`),
		genesisBlockBlobHash,
	);

	await createTarball(genesisBlockBlobFilepath, outputDir);
	const genesisBlockBlobTarballHash = await createChecksum(`${genesisBlockBlobFilepath}.tar.gz`);
	fs.writeFileSync(
		path.resolve(outputDir, `${FILE_NAME.GENESIS_BLOCK_BLOB}.tar.gz.SHA256`),
		genesisBlockBlobTarballHash,
	);

	// Genesis JSON handling
	const genesisBlockJsonFilepath = path.resolve(outputDir, FILE_NAME.GENESIS_BLOCK_JSON);

	const genesisBlockJsonHash = await createChecksum(genesisBlockJsonFilepath);
	fs.writeFileSync(
		path.resolve(outputDir, `${FILE_NAME.GENESIS_BLOCK_JSON}.SHA256`),
		genesisBlockJsonHash,
	);

	await createTarball(genesisBlockJsonFilepath, outputDir);
	const genesisBlockJsonTarBallHash = await createChecksum(`${genesisBlockJsonFilepath}.tar.gz`);
	fs.writeFileSync(
		path.resolve(outputDir, `${FILE_NAME.GENESIS_BLOCK_JSON}.tar.gz.SHA256`),
		genesisBlockJsonTarBallHash,
	);
};
