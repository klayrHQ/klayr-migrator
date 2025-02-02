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
import * as fs from 'fs-extra';
import { join } from 'path';
import Command from '@oclif/command';
import { log, error } from 'console';

import { getCommandsToExecPostMigration, writeCommandsToExec } from '../../../src/utils/commands';
import { exists } from '../../../src/utils/fs';
import { FILE_NAME, NETWORK_CONSTANT } from '../../../src/constants';

const outputDir = join(__dirname, '../../..', 'test/unit/fixtures');

afterAll(() => fs.removeSync(join(outputDir, FILE_NAME.COMMANDS_TO_EXEC)));

const mockCommand = {
	log,
	error,
};

describe('Test getCommandsToExecPostMigration method', () => {
	const snapshotHeight = 10815;

	it('should create commandsToExecute text file', async () => {
		const networkConstant = NETWORK_CONSTANT['00000000'];

		const commandsToExecute = await getCommandsToExecPostMigration(
			networkConstant,
			snapshotHeight,
			outputDir,
		);
		await writeCommandsToExec(
			mockCommand as Command,
			networkConstant,
			snapshotHeight,
			outputDir,
			commandsToExecute,
		);
		expect(await exists(`${outputDir}/${FILE_NAME.COMMANDS_TO_EXEC}`)).toBe(true);
	});
});
