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
/* eslint-disable no-param-reassign */
import * as fs from 'fs-extra';
import cli from 'cli-ux';
import { Command } from '@oclif/command';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { validator } from '@liskhq/lisk-validator';
import { ApplicationConfig, applicationConfigSchema } from 'lisk-framework';
import { objects } from '@liskhq/lisk-utils';
import { ApplicationConfigV4, LoggerConfig } from '../types';
import {
	DEFAULT_LISK_CONFIG_PATH,
	DEFAULT_VERSION,
	MAX_BFT_WEIGHT_CAP,
	NETWORK_CONSTANT,
	NUMBER_ACTIVE_VALIDATORS,
	NUMBER_STANDBY_VALIDATORS,
	POS_INIT_ROUNDS,
} from '../constants';
import { resolveAbsolutePath } from './path';

const LOG_LEVEL_PRIORITY = Object.freeze({
	FATAL: 0,
	ERROR: 1,
	WARN: 2,
	INFO: 3,
	DEBUG: 4,
	TRACE: 5,
}) as Record<string, number>;

export const getNetworkByNetworkID = (_networkID: string): string | Error => {
	const networkInfo = NETWORK_CONSTANT[_networkID];
	if (!networkInfo) {
		throw new Error('Migrator running against unidentified network. Cannot proceed.');
	}
	return networkInfo.name;
};

export const getLogLevel = (loggerConfig: LoggerConfig): string => {
	const highestLogPriority = Math.max(
		LOG_LEVEL_PRIORITY[String(loggerConfig.fileLogLevel || '').toUpperCase()] ??
			LOG_LEVEL_PRIORITY.INFO,
		LOG_LEVEL_PRIORITY[String(loggerConfig.consoleLogLevel || '').toUpperCase()] ??
			LOG_LEVEL_PRIORITY.INFO,
	);

	try {
		const [logLevel] = Object.entries(LOG_LEVEL_PRIORITY).find(
			([, v]) => v === highestLogPriority,
		) as [string, number];

		return logLevel.toLowerCase();
	} catch (err) {
		return 'info';
	}
};

export const getConfig = async (
	_this: Command,
	corePath: string,
	customConfigPath?: string,
): Promise<ApplicationConfigV4> => {
	const dataDirConfigPath = join(corePath, 'config', 'config.json');
	const dataDirConfig = await fs.readJSON(dataDirConfigPath);

	const customConfig = customConfigPath
		? await fs.readJSON(resolveAbsolutePath(customConfigPath))
		: {};

	cli.action.start('Compiling Lisk Core configuration');
	const config = objects.mergeDeep({}, dataDirConfig, customConfig) as ApplicationConfigV4;
	cli.action.stop();

	return config;
};

export const resolveConfigDefaultPath = async (): Promise<string> => DEFAULT_LISK_CONFIG_PATH;

export const createBackup = async (config: ApplicationConfigV4): Promise<void> => {
	const backupPath = join(__dirname, '../..', 'backup');
	mkdirSync(backupPath, { recursive: true });
	writeFileSync(resolve(`${backupPath}/config.json`), JSON.stringify(config, null, '\t'));
};

export const migrateUserConfig = async (
	configV4: ApplicationConfigV4,
	configKlayrV4: ApplicationConfig,
	snapshotHeight: number,
): Promise<ApplicationConfig> => {
	cli.action.start('Starting migration of custom config properties.');

	// Assign default version if not available
	if (!configKlayrV4.system?.version) {
		cli.action.start(`Setting config property 'system.version' to: ${DEFAULT_VERSION}.`);
		configKlayrV4.system.version = DEFAULT_VERSION;
		cli.action.stop();
	}

	if (configV4?.rootPath) {
		cli.action.start(`Setting config property 'system.dataPath' to: ${configV4.rootPath}.`);
		configKlayrV4.system.dataPath = configV4.rootPath;
		cli.action.stop();
	}

	if (configV4?.logger) {
		const logLevel = getLogLevel(configV4.logger);
		cli.action.start(`Setting config property 'system.logLevel' to: ${logLevel}.`);
		configKlayrV4.system.logLevel = logLevel;
		cli.action.stop();
	}

	if (configV4?.transactionPool) {
		if (configV4?.transactionPool?.maxTransactions) {
			cli.action.start(
				`Setting config property 'transactionPool.maxTransactions' to: ${configV4.transactionPool.maxTransactions}.`,
			);
			((configKlayrV4.transactionPool
				.maxTransactions as unknown) as number) = configV4.transactionPool.maxTransactions;
			cli.action.stop();
		}

		if (configV4?.transactionPool?.maxTransactionsPerAccount) {
			cli.action.start(
				`Setting config property 'transactionPool.maxTransactionsPerAccount' to: ${configV4.transactionPool.maxTransactionsPerAccount}.`,
			);
			((configKlayrV4.transactionPool
				.maxTransactionsPerAccount as unknown) as number) = configV4.transactionPool.maxTransactionsPerAccount;
			cli.action.stop();
		}

		if (configV4?.transactionPool?.transactionExpiryTime) {
			cli.action.start(
				`Setting config property 'transactionPool.transactionExpiryTime' to: ${configV4.transactionPool.transactionExpiryTime}.`,
			);
			((configKlayrV4.transactionPool
				.transactionExpiryTime as unknown) as number) = configV4.transactionPool.transactionExpiryTime;
			cli.action.stop();
		}

		if (configV4?.transactionPool?.minEntranceFeePriority) {
			cli.action.start(
				`Setting config property 'transactionPool.minEntranceFeePriority' to: ${configV4.transactionPool.minEntranceFeePriority}.`,
			);
			((configKlayrV4.transactionPool
				.minEntranceFeePriority as unknown) as string) = configV4.transactionPool.minEntranceFeePriority;
			cli.action.stop();
		}

		if (configV4?.transactionPool?.minReplacementFeeDifference) {
			cli.action.start(
				`Setting config property 'transactionPool.minReplacementFeeDifference' to: ${configV4.transactionPool.minReplacementFeeDifference}.`,
			);
			((configKlayrV4.transactionPool
				.minReplacementFeeDifference as unknown) as string) = configV4.transactionPool.minReplacementFeeDifference;
			cli.action.stop();
		}
	}

	if (configV4?.rpc?.mode) {
		cli.action.start(`Setting config property 'rpc.modes' to: ${configV4.rpc.mode}.`);
		configKlayrV4.rpc.modes = [configV4.rpc.mode];
		cli.action.stop();
	}

	if (configV4?.network) {
		if (configV4?.network?.port) {
			cli.action.start(`Setting config property 'network.port' to: ${configV4.network.port}.`);
			configKlayrV4.network.port = configV4.network.port;
			cli.action.stop();
		}

		if (configV4?.network?.hostIp) {
			cli.action.start(`Setting config property 'network.host' to: ${configV4.network.hostIp}.`);
			configKlayrV4.network.host = configV4.network.hostIp;
			cli.action.stop();
		}

		if (configV4?.network?.maxOutboundConnections) {
			cli.action.start(
				`Setting config property 'network.maxOutboundConnections' to: ${configV4.network.maxOutboundConnections}.`,
			);
			configKlayrV4.network.maxOutboundConnections = configV4.network.maxOutboundConnections;
			cli.action.stop();
		}

		if (configV4?.network?.maxInboundConnections) {
			cli.action.start(
				`Setting config property 'network.maxInboundConnections' to: ${configV4.network.maxInboundConnections}.`,
			);
			configKlayrV4.network.maxInboundConnections = configV4.network.maxInboundConnections;
			cli.action.stop();
		}

		if (configV4?.network?.wsMaxPayload) {
			cli.action.start(
				`Setting config property 'network.wsMaxPayload' to: ${configV4.network.wsMaxPayload}.`,
			);
			configKlayrV4.network.wsMaxPayload = configV4.network.wsMaxPayload;
			cli.action.stop();
		}

		if (configV4?.network?.advertiseAddress) {
			cli.action.start(
				`Setting config property 'network.advertiseAddress' to: ${configV4.network.advertiseAddress}.`,
			);
			configKlayrV4.network.advertiseAddress = configV4.network.advertiseAddress;
			cli.action.stop();
		}
	}

	cli.action.start("Calculating and updating config property 'genesis.minimumCertifyHeight'.");
	configKlayrV4.genesis.minimumCertifyHeight =
		snapshotHeight +
		1 +
		(POS_INIT_ROUNDS + NUMBER_ACTIVE_VALIDATORS - 1) *
			(NUMBER_ACTIVE_VALIDATORS + NUMBER_STANDBY_VALIDATORS);
	cli.action.stop();

	if (configKlayrV4.modules?.pos && !configKlayrV4.modules?.pos?.maxBFTWeightCap) {
		cli.action.start(
			`Setting config property 'modules.pos.maxBFTWeightCap' to: ${MAX_BFT_WEIGHT_CAP}.`,
		);
		configKlayrV4.modules.pos.maxBFTWeightCap = MAX_BFT_WEIGHT_CAP;
		cli.action.stop();
	}

	cli.action.stop();

	return configKlayrV4;
};

export const validateConfig = async (config: ApplicationConfig): Promise<boolean> => {
	try {
		const mergedConfig = objects.mergeDeep({}, applicationConfigSchema.default, config);
		(await validator.validate(applicationConfigSchema, mergedConfig)) as unknown;
		return true;
	} catch (error) {
		return false;
	}
};

export const writeConfig = async (config: ApplicationConfig, outputDir: string): Promise<void> => {
	if (!existsSync(outputDir)) {
		mkdirSync(outputDir, { recursive: true });
	}

	writeFileSync(resolve(outputDir, 'config.json'), JSON.stringify(config, null, '\t'));
};
