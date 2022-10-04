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
import { addAuthModuleEntry } from '../../../src/assets/auth';
import { MODULE_NAME_AUTH } from '../../../src/constants';
import { AccountEntry, AuthAccountEntry } from '../../../src/types';
import { createFakeDefaultAccount } from '../utils/account';
import { ADDRESS_LISK32 } from '../utils/regex';

describe('Build assets/auth', () => {
	let accounts: AccountEntry[];
	beforeAll(async () => {
		accounts = [
			createFakeDefaultAccount({
				address: Buffer.from('cc96c0a5db38b968f563e7af6fb435585c889111', 'hex'),
			}),
			createFakeDefaultAccount({
				address: Buffer.from('584dd8a902822a9469fb2911fcc14ed5fd98220d', 'hex'),
				keys: {
					mandatoryKeys: [
						Buffer.from('456efe283f25ea5bb21476b6dfb77cec4dbd33a4d1b5e60e4dc28e8e8b10fc4e', 'hex'),
					],
					optionalKeys: [],
					numberOfSignatures: 3,
				},
			}),
		];
	});

	it('should get auth accounts', async () => {
		const response = await addAuthModuleEntry(accounts);

		// Assert
		expect(response.module).toEqual(MODULE_NAME_AUTH);
		expect(response.data).toHaveLength(2);
		expect(Object.getOwnPropertyNames(response.data[0])).toEqual(['address', 'authAccount']);
		response.data.forEach((asset: { address: string; authAccount: AuthAccountEntry }) => {
			expect(asset.address).toEqual(expect.stringMatching(ADDRESS_LISK32));
			expect(Object.getOwnPropertyNames(asset.authAccount)).toEqual([
				'numberOfSignatures',
				'mandatoryKeys',
				'optionalKeys',
				'nonce',
			]);
		});
	});
});
