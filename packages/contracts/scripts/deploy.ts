import env from "../env";
import { network } from "hardhat";
import { isHex } from "viem";
import { fileURLToPath } from "node:url";

export async function deploy(_network: string) {
	const { viem, networkName } = await network.connect({
		network: _network ?? "hardhat",
	});
	const file = Bun.file("./definitions.gen.ts");

	const chainId = (await viem.getPublicClient()).chain.id;

	console.log(
		`Deploying to network ${networkName} with chain ID ${chainId}...`,
	);

	const SUPPORTED_MAINNETS = [
		{ id: 1, creName: "ethereum-mainnet" },
		{ id: 10, creName: "ethereum-mainnet-optimism-1" },
	];
	const SUPPORTED_TESTNETS = [
		{ id: 11155111, creName: "ethereum-testnet-sepolia" },
		{ id: 11155420, creName: "ethereum-testnet-sepolia-optimism-1" },
	];
	const WORKFLOW_NAMES = ["settlement-workflow"];

	if (
		![...SUPPORTED_MAINNETS, ...SUPPORTED_TESTNETS]
			.map((c) => c.id)
			.includes(chainId)
	) {
		throw new Error(
			`Unsupported network with chain ID ${chainId}. Supported mainnets: ${SUPPORTED_MAINNETS.map((c) => c.creName).join(", ")}. Supported testnets: ${SUPPORTED_TESTNETS.map((c) => c.creName).join(", ")}.`,
		);
	}

	const definitionsTextRaw = await file.text();
	const DEFINITIONS_FILE_PREFIX = "export const definitions = ";
	const DEFINITIONS_FILE_SUFFIX = "as const;";

	const definitions = JSON.parse(
		definitionsTextRaw
			.replace(DEFINITIONS_FILE_PREFIX, "")
			.replace(DEFINITIONS_FILE_SUFFIX, "") ?? "{}",
	);

	const usdc = await viem.deployContract("testUSDC", [
		BigInt(1_000_000 * 10 ** 6),
	]);

	console.log("USDC deployed to:", usdc.address);

	if (!isHex(env.TESTNET_FORWARDER_ADDRESS)) {
		throw new Error("Invalid forwarder address in .env");
	}

	const manager = await viem.deployContract("KXManager", [
		usdc.address,
		env.TESTNET_FORWARDER_ADDRESS,
	]);

	await Bun.sleep(1000);
	console.log("Manager deployed to:", manager.address);

	const sessionRegistry = await viem.getContractAt(
		"KXSessionRegistry",
		await manager.read.sessionRegistry(),
	);

	console.log("SessionRegistry deployed to:", sessionRegistry.address);

	const deployment = {
		USDC: {
			address: usdc.address,
			abi: usdc.abi,
		},
		KXManager: {
			address: manager.address,
			abi: manager.abi,
		},
		KXSessionRegistry: {
			address: sessionRegistry.address,
			abi: sessionRegistry.abi,
		},
	};
	definitions[networkName] = deployment;

	await file.write(
		`${DEFINITIONS_FILE_PREFIX}${JSON.stringify(definitions)}${DEFINITIONS_FILE_SUFFIX}`.replaceAll(
			"\n",
			"",
		),
	);

	for (const workflowName of WORKFLOW_NAMES) {
		const isTestnet = SUPPORTED_TESTNETS.map((c) => c.id).includes(chainId);
		const configFileName = isTestnet ? "config.test.json" : "config.main.json";
		const creConfigFile = Bun.file(
			`./workflows/${workflowName}/${configFileName}`,
		);
		const creConfigTextRaw = await creConfigFile.text();
		const creConfig = JSON.parse(creConfigTextRaw);

		creConfig.triggers[0].contract.address = sessionRegistry.address;

		const currentChain = [...SUPPORTED_MAINNETS, ...SUPPORTED_TESTNETS].find(
			(c) => c.id === chainId,
		);

		if (currentChain) {
			const evmEntry = creConfig.evms?.find(
				(evm: { chainSelectorName: string }) =>
					evm.chainSelectorName === currentChain.creName,
			);

			if (evmEntry) {
				evmEntry.sessionRegistryAddress = sessionRegistry.address;
			} else {
				if (!creConfig.evms) {
					creConfig.evms = [];
				}
				creConfig.evms.push({
					chainSelectorName: currentChain.creName,
					gasLimit: "1000000",
					sessionRegistryAddress: sessionRegistry.address,
				});
			}
		}

		await creConfigFile.write(JSON.stringify(creConfig, null, 2));
	}

	return deployment;
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
	const argv = require("minimist")(process.argv.slice(2));

	if (!argv.network) {
		console.error("Please specify a network using --network");
		process.exit(1);
	}

	deploy(argv.network);
}
