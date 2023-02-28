/*
 * Copyright © 2022 Lisk Foundation
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
import { createIPCClient, APIClient } from '@liskhq/lisk-api-client';

// let client: APIClient;

export const getAPIClient = async (liskCorePath: string): Promise<APIClient> => {
	const client = await createIPCClient(liskCorePath);
	return client;
};
