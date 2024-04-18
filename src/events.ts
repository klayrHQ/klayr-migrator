/*
 * Copyright © 2023 Lisk Foundation
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
import { resolve } from 'path';
import { Command } from '@oclif/command';
import { APIClient } from '@liskhq/lisk-api-client';
import { write } from './utils/fs';
import { EVENT_NEW_BLOCK, FILE_NAME } from './constants';
import { ForgingStatus } from './types';

export const captureForgingStatusAtSnapshotHeight = (
	_this: Command,
	client: APIClient,
	snapshotHeight: number,
	outputDir: string,
) => {
	client.subscribe(EVENT_NEW_BLOCK, async data => {
		const { block: encodedBlock } = (data as unknown) as Record<string, string>;
		const newBlock = client.block.decode(Buffer.from(encodedBlock, 'hex'));

		if (newBlock.header.height === snapshotHeight) {
			const finalForgingStatuses: ForgingStatus[] = await client.invoke('generator:status');

			if (finalForgingStatuses.length) {
				try {
					const forgingStatusJsonFilepath = resolve(outputDir, FILE_NAME.FORGING_STATUS);
					await write(forgingStatusJsonFilepath, JSON.stringify(finalForgingStatuses, null, '\t'));
					_this.log(`\nFinished exporting forging status to ${forgingStatusJsonFilepath}.`);
				} catch (error) {
					_this.log(
						`\nUnable to save the node Forging Status information to the disk, please find it below instead:\n${JSON.stringify(
							finalForgingStatuses,
							null,
							2,
						)}`,
					);
				}
			}
		}
	});
};
