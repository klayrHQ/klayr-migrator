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
import {
	MAX_NUMBER_BYTES_Q96,
	TOKEN_ID_LENGTH,
	MAX_COMMISSION,
	DEFAULT_HOST,
	DEFAULT_PORT_P2P,
	DEFAULT_PORT_RPC,
} from './constants';

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

export const blockHeaderSchema = {
	...signingBlockHeaderSchema,
	$id: '/block/header',
	properties: {
		...signingBlockHeaderSchema.properties,
		signature: { dataType: 'bytes', fieldNumber: 9 },
	},
};

export declare const transactionSchema: {
	$id: string;
	type: string;
	required: string[];
	properties: {
		moduleID: {
			dataType: string;
			fieldNumber: number;
			minimum: number;
		};
		assetID: {
			dataType: string;
			fieldNumber: number;
		};
		nonce: {
			dataType: string;
			fieldNumber: number;
		};
		fee: {
			dataType: string;
			fieldNumber: number;
		};
		senderPublicKey: {
			dataType: string;
			fieldNumber: number;
			minLength: number;
			maxLength: number;
		};
		asset: {
			dataType: string;
			fieldNumber: number;
		};
		signatures: {
			type: string;
			items: {
				dataType: string;
			};
			fieldNumber: number;
		};
	};
};

export const voteWeightsSchema = {
	$id: '/dpos/voteWeights',
	type: 'object',
	properties: {
		voteWeights: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				properties: {
					round: {
						dataType: 'uint32',
						fieldNumber: 1,
					},
					delegates: {
						type: 'array',
						fieldNumber: 2,
						items: {
							type: 'object',
							properties: {
								address: {
									dataType: 'bytes',
									fieldNumber: 1,
								},
								voteWeight: {
									dataType: 'uint64',
									fieldNumber: 2,
								},
							},
						},
					},
				},
			},
		},
	},
	required: ['voteWeights'],
};

export const genesisTokenStoreSchema = {
	$id: '/token/module/genesis',
	type: 'object',
	required: ['userSubstore', 'supplySubstore', 'escrowSubstore', 'supportedTokensSubstore'],
	properties: {
		userSubstore: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: ['address', 'tokenID', 'availableBalance', 'lockedBalances'],
				properties: {
					address: {
						dataType: 'bytes',
						format: 'lisk32',
						fieldNumber: 1,
					},
					tokenID: {
						dataType: 'bytes',
						fieldNumber: 2,
						minLength: 8,
						maxLength: 8,
					},
					availableBalance: {
						dataType: 'uint64',
						fieldNumber: 3,
					},
					lockedBalances: {
						type: 'array',
						fieldNumber: 4,
						items: {
							type: 'object',
							required: ['module', 'amount'],
							properties: {
								module: {
									dataType: 'string',
									fieldNumber: 1,
								},
								amount: {
									dataType: 'uint64',
									fieldNumber: 2,
								},
							},
						},
					},
				},
			},
		},
		supplySubstore: {
			type: 'array',
			fieldNumber: 2,
			items: {
				type: 'object',
				required: ['tokenID', 'totalSupply'],
				properties: {
					tokenID: {
						dataType: 'bytes',
						fieldNumber: 1,
						minLength: 8,
						maxLength: 8,
					},
					totalSupply: {
						dataType: 'uint64',
						fieldNumber: 2,
					},
				},
			},
		},
		escrowSubstore: {
			type: 'array',
			fieldNumber: 3,
			items: {
				type: 'object',
				required: ['escrowChainID', 'tokenID', 'amount'],
				properties: {
					escrowChainID: {
						dataType: 'bytes',
						fieldNumber: 1,
						minLength: 4,
						maxLength: 4,
					},
					tokenID: {
						dataType: 'bytes',
						fieldNumber: 2,
						minLength: 8,
						maxLength: 8,
					},
					amount: {
						dataType: 'uint64',
						fieldNumber: 3,
					},
				},
			},
		},
		supportedTokensSubstore: {
			type: 'array',
			fieldNumber: 4,
			items: {
				type: 'object',
				required: ['chainID', 'supportedTokenIDs'],
				properties: {
					chainID: {
						dataType: 'bytes',
						minLength: 4,
						maxLength: 4,
						fieldNumber: 1,
					},
					supportedTokenIDs: {
						type: 'array',
						fieldNumber: 2,
						items: {
							dataType: 'bytes',
							minLength: 8,
							maxLength: 8,
						},
					},
				},
			},
		},
	},
};

export const genesisPoSSchema = {
	$id: '/pos/module/genesis',
	type: 'object',
	required: ['validators', 'stakers', 'genesisData'],
	properties: {
		validators: {
			type: 'array',
			fieldNumber: 1,
			items: {
				type: 'object',
				required: [
					'address',
					'name',
					'blsKey',
					'proofOfPossession',
					'generatorKey',
					'lastGeneratedHeight',
					'isBanned',
					'pomHeights',
					'consecutiveMissedBlocks',
					'commission',
					'lastCommissionIncreaseHeight',
					'sharingCoefficients',
				],
				properties: {
					address: {
						dataType: 'bytes',
						format: 'lisk32',
						fieldNumber: 1,
					},
					name: {
						dataType: 'string',
						fieldNumber: 2,
						minLength: 1,
						maxLength: 20,
					},
					blsKey: {
						dataType: 'bytes',
						fieldNumber: 3,
						minLength: 48,
						maxLength: 48,
					},
					proofOfPossession: {
						dataType: 'bytes',
						fieldNumber: 4,
						minLength: 96,
						maxLength: 96,
					},
					generatorKey: {
						dataType: 'bytes',
						fieldNumber: 5,
						minLength: 32,
						maxLength: 32,
					},
					lastGeneratedHeight: {
						dataType: 'uint32',
						fieldNumber: 6,
					},
					isBanned: {
						dataType: 'boolean',
						fieldNumber: 7,
					},
					pomHeights: {
						type: 'array',
						fieldNumber: 8,
						items: { dataType: 'uint32' },
					},
					consecutiveMissedBlocks: {
						dataType: 'uint32',
						fieldNumber: 9,
					},
					commission: {
						dataType: 'uint32',
						fieldNumber: 10,
						maximum: MAX_COMMISSION,
					},
					lastCommissionIncreaseHeight: {
						dataType: 'uint32',
						fieldNumber: 11,
					},
					sharingCoefficients: {
						type: 'array',
						fieldNumber: 12,
						items: {
							type: 'object',
							required: ['tokenID', 'coefficient'],
							properties: {
								tokenID: {
									dataType: 'bytes',
									minLength: TOKEN_ID_LENGTH,
									maxLength: TOKEN_ID_LENGTH,
									fieldNumber: 1,
								},
								coefficient: {
									dataType: 'bytes',
									maxLength: MAX_NUMBER_BYTES_Q96,
									fieldNumber: 2,
								},
							},
						},
					},
				},
			},
		},
		stakers: {
			type: 'array',
			fieldNumber: 2,
			items: {
				type: 'object',
				required: ['address', 'sentStakes', 'pendingUnlocks'],
				properties: {
					address: {
						dataType: 'bytes',
						format: 'lisk32',
						fieldNumber: 1,
					},
					sentStakes: {
						type: 'array',
						fieldNumber: 2,
						items: {
							type: 'object',
							required: ['validatorAddress', 'amount'],
							properties: {
								validatorAddress: {
									dataType: 'bytes',
									format: 'lisk32',
									fieldNumber: 1,
								},
								amount: {
									dataType: 'uint64',
									fieldNumber: 2,
								},
								stakeSharingCoefficients: {
									type: 'array',
									fieldNumber: 3,
									items: {
										type: 'object',
										required: ['tokenID', 'coefficient'],
										properties: {
											tokenID: {
												dataType: 'bytes',
												minLength: TOKEN_ID_LENGTH,
												maxLength: TOKEN_ID_LENGTH,
												fieldNumber: 1,
											},
											coefficient: {
												dataType: 'bytes',
												maxLength: MAX_NUMBER_BYTES_Q96,
												fieldNumber: 2,
											},
										},
									},
								},
							},
						},
					},
					pendingUnlocks: {
						type: 'array',
						fieldNumber: 3,
						items: {
							type: 'object',
							required: ['validatorAddress', 'amount', 'unstakeHeight'],
							properties: {
								validatorAddress: {
									dataType: 'bytes',
									fieldNumber: 1,
									format: 'lisk32',
								},
								amount: {
									dataType: 'uint64',
									fieldNumber: 2,
								},
								unstakeHeight: {
									dataType: 'uint32',
									fieldNumber: 3,
								},
							},
						},
					},
				},
			},
		},
		genesisData: {
			type: 'object',
			fieldNumber: 3,
			required: ['initRounds', 'initValidators'],
			properties: {
				initRounds: {
					dataType: 'uint32',
					fieldNumber: 1,
				},
				initValidators: {
					type: 'array',
					fieldNumber: 2,
					items: { dataType: 'bytes', format: 'lisk32' },
				},
			},
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
				required: ['storeKey', 'storeValue'],
				properties: {
					storeKey: {
						dataType: 'bytes',
						format: 'lisk32',
						fieldNumber: 1,
					},
					storeValue: {
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

export const applicationConfigSchema = {
	$id: '#/config',
	type: 'object',
	required: ['system', 'rpc', 'network', 'modules', 'plugins', 'genesis'],
	properties: {
		system: {
			type: 'object',
			required: ['version', 'dataPath', 'logLevel', 'keepEventsForHeights'],
			properties: {
				version: {
					type: 'string',
					format: 'version',
				},
				dataPath: {
					type: 'string',
				},
				logLevel: {
					type: 'string',
					enum: ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'none'],
				},
				keepEventsForHeights: {
					type: 'integer',
				},
			},
		},
		rpc: {
			type: 'object',
			required: ['modes', 'host', 'port'],
			properties: {
				modes: {
					type: 'array',
					items: { type: 'string', enum: ['ipc', 'ws', 'http'] },
					uniqueItems: true,
				},
				host: { type: 'string' },
				port: { type: 'number', minimum: 1024, maximum: 65535 },
			},
		},
		legacy: {
			type: 'object',
			required: ['brackets'],
			properties: {
				sync: { type: 'boolean' },
				brackets: {
					type: 'array',
					items: {
						type: 'object',
						required: ['startHeight', 'snapshotHeight', 'snapshotBlockID'],
						properties: {
							startHeight: { type: 'number', minimum: 0 },
							snapshotHeight: { type: 'number', minimum: 0 },
							snapshotBlockID: { type: 'string', format: 'hex' },
						},
					},
				},
			},
		},
		network: {
			type: 'object',
			properties: {
				version: {
					type: 'string',
					format: 'networkVersion',
				},
				port: {
					type: 'integer',
					minimum: 1,
					maximum: 65535,
				},
				host: {
					type: 'string',
					format: 'ip',
				},
				seedPeers: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							ip: {
								type: 'string',
								format: 'ipOrFQDN',
							},
							port: {
								type: 'integer',
								minimum: 1,
								maximum: 65535,
							},
						},
					},
				},
				blacklistedIPs: {
					type: 'array',
					items: {
						type: 'string',
						format: 'ip',
					},
				},
				// Warning! The connectivity of the node might be negatively impacted if using this option.
				fixedPeers: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							ip: {
								type: 'string',
								format: 'ip',
							},
							port: {
								type: 'integer',
								minimum: 1,
								maximum: 65535,
							},
						},
					},
					maximum: 4,
				},
				// Warning! Beware of declaring only trustworthy peers in this array as these could attack a
				// node with a denial-of-service attack because the banning mechanism is deactivated.
				whitelistedPeers: {
					type: 'array',
					items: {
						type: 'object',
						properties: {
							ip: {
								type: 'string',
								format: 'ip',
							},
							port: {
								type: 'integer',
								minimum: 1,
								maximum: 65535,
							},
						},
					},
				},
				maxOutboundConnections: {
					type: 'integer',
				},
				maxInboundConnections: {
					type: 'integer',
				},
				wsMaxPayload: {
					type: 'integer',
					maximum: 3048576,
				},
				advertiseAddress: {
					type: 'boolean',
				},
			},
			required: ['seedPeers'],
		},
		transactionPool: {
			type: 'object',
			properties: {
				maxTransactions: {
					type: 'integer',
					minimum: 1,
				},
				maxTransactionsPerAccount: {
					type: 'integer',
					minimum: 1,
				},
				transactionExpiryTime: {
					type: 'integer',
					minimum: 60 * 1000,
				},
				minEntranceFeePriority: {
					type: 'string',
					format: 'uint64',
				},
				minReplacementFeeDifference: {
					type: 'string',
					format: 'uint64',
				},
			},
		},
		genesis: {
			type: 'object',
			required: ['block', 'blockTime', 'bftBatchSize', 'chainID', 'maxTransactionsSize'],
			properties: {
				block: {
					type: 'object',
					oneOf: [
						{
							required: ['fromFile'],
							properties: {
								fromFile: {
									type: 'string',
								},
								blob: {
									type: 'string',
									format: 'hex',
								},
							},
						},
						{
							required: ['blob'],
							properties: {
								fromFile: {
									type: 'string',
								},
								blob: {
									type: 'string',
									format: 'hex',
								},
							},
						},
					],
				},
				blockTime: {
					type: 'number',
					minimum: 2,
					description: 'Slot time interval in seconds',
				},
				bftBatchSize: {
					type: 'number',
					minimum: 1,
					description: 'The length of a round',
				},
				chainID: {
					type: 'string',
					format: 'hex',
					description: 'The unique name of the chain as a string encoded in Hex format',
				},
				maxTransactionsSize: {
					type: 'integer',
					minimum: 10 * 1024, // Kilo Bytes
					maximum: 30 * 1024, // Kilo Bytes
					description: 'Maximum number of transactions allowed per block',
				},
			},
			additionalProperties: false,
		},
		generator: {
			type: 'object',
			required: ['keys'],
			properties: {
				keys: {
					type: 'object',
					properties: {
						fromFile: {
							type: 'string',
							description: 'Path to a file which stores keys',
						},
					},
				},
			},
		},
		modules: {
			type: 'object',
			propertyNames: {
				pattern: '^[a-zA-Z][a-zA-Z0-9_]*$',
			},
			additionalProperties: { type: 'object' },
		},
		plugins: {
			type: 'object',
		},
	},
	additionalProperties: false,
	default: {
		system: {
			dataPath: '~/.lisk/beta-sdk-app',
			version: '0.1.0',
			keepEventsForHeights: 300,
			logLevel: 'info',
		},
		rpc: {
			modes: ['ipc'],
			port: DEFAULT_PORT_RPC,
			host: DEFAULT_HOST,
		},
		legacy: {
			sync: false,
			brackets: [],
		},
		network: {
			version: '1.0',
			seedPeers: [],
			port: DEFAULT_PORT_P2P,
		},
		transactionPool: {
			maxTransactions: 4096,
			maxTransactionsPerAccount: 64,
			transactionExpiryTime: 3 * 60 * 60 * 1000,
			minEntranceFeePriority: '0',
			minReplacementFeeDifference: '10',
		},
		genesis: {
			block: {
				fromFile: './config/genesis_block.blob',
			},
			blockTime: 10,
			bftBatchSize: 103,
			maxTransactionsSize: 15 * 1024, // Kilo Bytes
		},
		generator: {
			keys: {},
		},
		modules: {},
		plugins: {},
	},
};
