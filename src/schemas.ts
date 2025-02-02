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
import { LENGTH_BLS_KEY, LENGTH_GENERATOR_KEY, LENGTH_PROOF_OF_POSSESSION } from './constants';

export const unregisteredAddressesSchema = {
	$id: '/legacyAccount/unregisteredAddresses',
	type: 'object',
	properties: {
		unregisteredAddresses: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				properties: {
					address: {
						dataType: 'bytes',
						fieldNumber: 1,
					},
					balance: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
				},
				required: ['address', 'balance'],
			},
		},
	},
	required: ['unregisteredAddresses'],
};

export const accountSchema = {
	$id: '/account/base',
	type: 'object',
	properties: {
		address: {
			dataType: 'bytes',
			fieldNumber: 1,
		},
		token: {
			type: 'object',
			properties: {
				balance: {
					fieldNumber: 1,
					dataType: 'uint64',
				},
			},
			fieldNumber: 2,
		},
		sequence: {
			type: 'object',
			properties: {
				nonce: {
					fieldNumber: 1,
					dataType: 'uint64',
				},
			},
			fieldNumber: 3,
		},
		keys: {
			type: 'object',
			properties: {
				numberOfSignatures: {
					dataType: 'uint32',
					fieldNumber: 1,
				},
				mandatoryKeys: {
					type: 'array',
					items: {
						dataType: 'bytes',
					},
					fieldNumber: 2,
				},
				optionalKeys: {
					type: 'array',
					items: {
						dataType: 'bytes',
					},
					fieldNumber: 3,
				},
			},
			fieldNumber: 4,
		},
		dpos: {
			type: 'object',
			properties: {
				delegate: {
					type: 'object',
					fieldNumber: 1,
					properties: {
						username: {
							dataType: 'string',
							fieldNumber: 1,
						},
						pomHeights: {
							type: 'array',
							items: {
								dataType: 'uint32',
							},
							fieldNumber: 2,
						},
						consecutiveMissedBlocks: {
							dataType: 'uint32',
							fieldNumber: 3,
						},
						lastForgedHeight: {
							dataType: 'uint32',
							fieldNumber: 4,
						},
						isBanned: {
							dataType: 'boolean',
							fieldNumber: 5,
						},
						totalVotesReceived: {
							dataType: 'uint64',
							fieldNumber: 6,
						},
					},
					required: [
						'username',
						'pomHeights',
						'consecutiveMissedBlocks',
						'lastForgedHeight',
						'isBanned',
						'totalVotesReceived',
					],
				},
				sentVotes: {
					type: 'array',
					fieldNumber: 2,
					items: {
						type: 'object',
						properties: {
							delegateAddress: {
								dataType: 'bytes',
								fieldNumber: 1,
							},
							amount: {
								dataType: 'uint64',
								fieldNumber: 2,
							},
						},
						required: ['delegateAddress', 'amount'],
					},
				},
				unlocking: {
					type: 'array',
					fieldNumber: 3,
					items: {
						type: 'object',
						properties: {
							delegateAddress: {
								dataType: 'bytes',
								fieldNumber: 1,
							},
							amount: {
								dataType: 'uint64',
								fieldNumber: 2,
							},
							unvoteHeight: {
								dataType: 'uint32',
								fieldNumber: 3,
							},
						},
						required: ['delegateAddress', 'amount', 'unvoteHeight'],
					},
				},
			},
			fieldNumber: 5,
		},
	},
	required: ['address', 'token', 'sequence', 'keys', 'dpos'],
};

export const signingBlockHeaderSchema = {
	$id: '/block/header/signing',
	type: 'object',
	properties: {
		version: { dataType: 'uint32', fieldNumber: 1 },
		timestamp: { dataType: 'uint32', fieldNumber: 2 },
		height: { dataType: 'uint32', fieldNumber: 3 },
		previousBlockID: { dataType: 'bytes', fieldNumber: 4 },
		transactionRoot: { dataType: 'bytes', fieldNumber: 5 },
		generatorPublicKey: { dataType: 'bytes', fieldNumber: 6 },
		reward: { dataType: 'uint64', fieldNumber: 7 },
		asset: { dataType: 'bytes', fieldNumber: 8 },
	},
	required: [
		'version',
		'timestamp',
		'height',
		'previousBlockID',
		'transactionRoot',
		'generatorPublicKey',
		'reward',
		'asset',
	],
};

export const legacyAccountStoreSchema = {
	$id: '/legacy/store/genesis',
	type: 'object',
	required: ['balance'],
	properties: {
		balance: {
			dataType: 'uint64',
			fieldNumber: 1,
		},
	},
};

export const genesisLegacyStoreSchema = {
	$id: '/legacy/module/genesis',
	type: 'object',
	required: ['accounts'],
	properties: {
		accounts: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: ['address', 'balance'],
				properties: {
					address: {
						dataType: 'bytes',
						minLength: 8,
						maxLength: 8,
						fieldNumber: 1,
					},
					balance: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
				},
			},
		},
	},
};

export const genesisAuthStoreSchema = {
	$id: '/auth/module/genesis',
	type: 'object',
	required: ['authDataSubstore'],
	properties: {
		authDataSubstore: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: ['address', 'authAccount'],
				properties: {
					address: {
						dataType: 'bytes',
						format: 'klayr32',
						fieldNumber: 1,
					},
					authAccount: {
						type: 'object',
						fieldNumber: 2,
						required: ['nonce', 'numberOfSignatures', 'mandatoryKeys', 'optionalKeys'],
						properties: {
							nonce: {
								dataType: 'uint64',
								fieldNumber: 1,
							},
							numberOfSignatures: {
								dataType: 'uint32',
								fieldNumber: 2,
							},
							mandatoryKeys: {
								type: 'array',
								fieldNumber: 3,
								items: {
									dataType: 'bytes',
								},
							},
							optionalKeys: {
								type: 'array',
								fieldNumber: 4,
								items: {
									dataType: 'bytes',
								},
							},
						},
					},
				},
			},
		},
	},
};

export const registerKeysParamsSchema = {
	$id: '/legacy/command/registerKeysParams',
	type: 'object',
	required: ['blsKey', 'proofOfPossession', 'generatorKey'],
	properties: {
		blsKey: {
			dataType: 'bytes',
			minLength: LENGTH_BLS_KEY,
			maxLength: LENGTH_BLS_KEY,
			fieldNumber: 1,
		},
		proofOfPossession: {
			dataType: 'bytes',
			minLength: LENGTH_PROOF_OF_POSSESSION,
			maxLength: LENGTH_PROOF_OF_POSSESSION,
			fieldNumber: 2,
		},
		generatorKey: {
			dataType: 'bytes',
			minLength: LENGTH_GENERATOR_KEY,
			maxLength: LENGTH_GENERATOR_KEY,
			fieldNumber: 3,
		},
	},
};
