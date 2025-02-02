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
import { utils, legacy, legacyAddress } from '@liskhq/lisk-cryptography';

import { getLegacyModuleEntry, LegacyDBAccount } from '../../../src/assets/legacy';
import { MODULE_NAME_LEGACY } from '../../../src/constants';
import { LegacyStoreData, LegacyStoreEntry } from '../../../src/types';

const { hash } = utils;
const { getKeys } = legacy;
const { getFirstEightBytesReversed } = legacyAddress;

const getLegacyBytesFromPassphrase = (passphrase: string): Buffer => {
	const { publicKey } = getKeys(passphrase);
	return getFirstEightBytesReversed(hash(publicKey));
};

describe('Build assets/legacy', () => {
	const unregisteredAddresses: LegacyDBAccount[] = [];

	interface Accounts {
		[key: string]: {
			passphrase: string;
		};
	}

	const testAccounts: Accounts = {
		account1: {
			passphrase: 'float slow tiny rubber seat lion arrow skirt reveal garlic draft shield',
		},
		account2: {
			passphrase: 'hand nominee keen alarm skate latin seek fox spring guilt loop snake',
		},
		account3: {
			passphrase: 'february large secret save risk album opera rebel tray roast air captain',
		},
	};

	describe('getLegacyModuleEntry', () => {
		beforeAll(async () => {
			for (const account of Object.values(testAccounts)) {
				unregisteredAddresses.push({
					key: getLegacyBytesFromPassphrase(account.passphrase),
					value: {
						address: getLegacyBytesFromPassphrase(account.passphrase),
						balance: BigInt(Math.floor(Math.random() * 1000)).toString(),
					},
				});
			}
		});

		it('should get legacy accounts', async () => {
			const response = await getLegacyModuleEntry(unregisteredAddresses);
			const data = (response.data as unknown) as LegacyStoreData;

			// Assert
			expect(response.module).toEqual(MODULE_NAME_LEGACY);
			expect(data.accounts.length).toBeGreaterThan(0);
			data.accounts.forEach((account: LegacyStoreEntry) => {
				expect(Object.getOwnPropertyNames(account)).toEqual(['address', 'balance']);
			});
		});
	});
});
