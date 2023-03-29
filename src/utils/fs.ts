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
import * as tar from 'tar';
import fs from 'fs';

export const extractTarBall = async (
	srcFilePath: string,
	destDirPath: string,
): Promise<boolean | Error> =>
	new Promise((resolve, reject) => {
		if (fs.existsSync(destDirPath)) fs.rmdirSync(destDirPath, { recursive: true });
		fs.mkdirSync(destDirPath, { recursive: true });

		const fileStream = fs.createReadStream(srcFilePath);
		fileStream.pipe(tar.extract({ cwd: destDirPath }));
		fileStream.on('error', err => reject(new Error(err)));
		// Adding delay of 100ms since the promise resolves earlier than expected
		fileStream.on('end', () => setTimeout(resolve.bind(null, true), 100));
	});

export const exists = async (path: string): Promise<boolean | Error> => {
	try {
		await fs.promises.access(path);
		return true;
	} catch (_) {
		return false;
	}
};

export const rmdir = async (directoryPath: string, options = {}): Promise<boolean | Error> =>
	new Promise((resolve, reject) => {
		fs.rmdir(directoryPath, options, err => {
			if (err) return reject(err);
			return resolve(true);
		});
	});
