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
import { createServer } from 'net';

import { NetworkConfigLocal, Port } from '../types';
import { getAPIClient } from '../client';
import { NETWORK_CONSTANT } from '../constants';

export const isPortAvailable = async (port: Port): Promise<boolean | Error> =>
	new Promise((resolve, reject) => {
		const server = createServer();

		server.once('error', (err: { code: string }) => {
			if (err.code === 'EADDRINUSE') {
				// Port is currently in use
				resolve(false);
			} else {
				reject(err);
			}
		});

		server.once('listening', () => {
			// Close the server if listening doesn't fail
			server.close(() => resolve(true));
		});

		server.listen(port);
	});

export const getChainId = async (
	network: string | null,
	liskCoreV4DataPath: string,
): Promise<string> => {
	const chainID = network
		? (() => {
				const networkConstantEntry = Object.entries(NETWORK_CONSTANT).find(
					([, v]) => v.name === network,
				) as [string, NetworkConfigLocal];

				const [chainId] = networkConstantEntry;
				return chainId;
		  })()
		: await (async () => {
				const client = await getAPIClient(liskCoreV4DataPath);
				const nodeInfo = await client.node.getNodeInfo();
				return nodeInfo.chainID;
		  })();

	return chainID;
};
