import { fileURLToPath } from "node:url";
import { network } from "hardhat";
import { isHex } from "viem";
import env from "../env";

type Deployment = {
	USDC: { address: string; abi: unknown[] };
	KXManager: { address: string; abi: unknown[] };
	KXSessionRegistry: { address: string; abi: unknown[] };
};

const SUPPORTED_MAINNETS = [
	{ id: 1, creName: "ethereum-mainnet" },
	{ id: 10, creName: "ethereum-mainnet-optimism-1" },
];
const SUPPORTED_TESTNETS = [
	{ id: 11155111, creName: "ethereum-testnet-sepolia" },
	{ id: 11155420, creName: "ethereum-testnet-sepolia-optimism-1" },
];
const WORKFLOW_NAMES = [
	{
		folder: "settlement-workflow",
		contractKey: "sessionRegistryAddress",
		contract: "KXSessionRegistry",
	},
	{
		folder: "initiation-workflow",
		contractKey: "managerAddress",
		contract: "KXManager",
	},
] as const;

const usdc = {
	address: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as const,
	abi: [
		{
			constant: true,
			inputs: [],
			name: "name",
			outputs: [
				{
					name: "",
					type: "string",
				},
			],
			payable: false,
			stateMutability: "view",
			type: "function",
		},
		{
			constant: false,
			inputs: [
				{
					name: "_spender",
					type: "address",
				},
				{
					name: "_value",
					type: "uint256",
				},
			],
			name: "approve",
			outputs: [
				{
					name: "",
					type: "bool",
				},
			],
			payable: false,
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			constant: true,
			inputs: [],
			name: "totalSupply",
			outputs: [
				{
					name: "",
					type: "uint256",
				},
			],
			payable: false,
			stateMutability: "view",
			type: "function",
		},
		{
			constant: false,
			inputs: [
				{
					name: "_from",
					type: "address",
				},
				{
					name: "_to",
					type: "address",
				},
				{
					name: "_value",
					type: "uint256",
				},
			],
			name: "transferFrom",
			outputs: [
				{
					name: "",
					type: "bool",
				},
			],
			payable: false,
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			constant: true,
			inputs: [],
			name: "decimals",
			outputs: [
				{
					name: "",
					type: "uint8",
				},
			],
			payable: false,
			stateMutability: "view",
			type: "function",
		},
		{
			constant: true,
			inputs: [
				{
					name: "_owner",
					type: "address",
				},
			],
			name: "balanceOf",
			outputs: [
				{
					name: "balance",
					type: "uint256",
				},
			],
			payable: false,
			stateMutability: "view",
			type: "function",
		},
		{
			constant: true,
			inputs: [],
			name: "symbol",
			outputs: [
				{
					name: "",
					type: "string",
				},
			],
			payable: false,
			stateMutability: "view",
			type: "function",
		},
		{
			constant: false,
			inputs: [
				{
					name: "_to",
					type: "address",
				},
				{
					name: "_value",
					type: "uint256",
				},
			],
			name: "transfer",
			outputs: [
				{
					name: "",
					type: "bool",
				},
			],
			payable: false,
			stateMutability: "nonpayable",
			type: "function",
		},
		{
			constant: true,
			inputs: [
				{
					name: "_owner",
					type: "address",
				},
				{
					name: "_spender",
					type: "address",
				},
			],
			name: "allowance",
			outputs: [
				{
					name: "",
					type: "uint256",
				},
			],
			payable: false,
			stateMutability: "view",
			type: "function",
		},
		{
			payable: true,
			stateMutability: "payable",
			type: "fallback",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					name: "owner",
					type: "address",
				},
				{
					indexed: true,
					name: "spender",
					type: "address",
				},
				{
					indexed: false,
					name: "value",
					type: "uint256",
				},
			],
			name: "Approval",
			type: "event",
		},
		{
			anonymous: false,
			inputs: [
				{
					indexed: true,
					name: "from",
					type: "address",
				},
				{
					indexed: true,
					name: "to",
					type: "address",
				},
				{
					indexed: false,
					name: "value",
					type: "uint256",
				},
			],
			name: "Transfer",
			type: "event",
		},
	],
};

async function writeFiles(_network: string, deployment?: Deployment) {
	if (!deployment) {
		console.warn("No deployment data provided, skipping file writes");
		return;
	}

	const { networkName, viem } = await network.connect({
		network: _network ?? "hardhat",
	});
	const file = Bun.file("./definitions.gen.ts");
	const chainId = (await viem.getPublicClient()).chain.id;

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

	definitions[networkName] = deployment;

	await file.write(
		`${DEFINITIONS_FILE_PREFIX}${JSON.stringify(definitions)}${DEFINITIONS_FILE_SUFFIX}`.replaceAll(
			"\n",
			"",
		),
	);

	for (const w of WORKFLOW_NAMES) {
		const isTestnet = SUPPORTED_TESTNETS.map((c) => c.id).includes(chainId);
		const configFileName = isTestnet ? "config.test.json" : "config.main.json";
		const creConfigFile = Bun.file(`./workflows/${w.folder}/${configFileName}`);
		const creConfigTextRaw = await creConfigFile.text();
		const creConfig = JSON.parse(creConfigTextRaw);

		creConfig.triggers[0].contract.address = deployment[w.contract].address;

		const currentChain = [...SUPPORTED_MAINNETS, ...SUPPORTED_TESTNETS].find(
			(c) => c.id === chainId,
		);

		if (currentChain) {
			const evmEntry = creConfig.evms?.find(
				(evm: { chainSelectorName: string }) =>
					evm.chainSelectorName === currentChain.creName,
			);

			if (evmEntry) {
				evmEntry.sessionRegistryAddress = deployment[w.contract].address;
			} else {
				if (!creConfig.evms) {
					creConfig.evms = [];
				}
				creConfig.evms.push({
					chainSelectorName: currentChain.creName,
					gasLimit: "1000000",
					[w.contractKey]: deployment[w.contract].address,
				});
			}
		}

		await creConfigFile.write(JSON.stringify(creConfig, null, 2));
	}
}

export async function deploy(_network: string) {
	const { viem, networkName } = await network.connect({
		network: _network ?? "hardhat",
	});

	const chainId = (await viem.getPublicClient()).chain.id;

	console.log(
		`Deploying to network ${networkName} with chain ID ${chainId}...`,
	);

	if (
		![...SUPPORTED_MAINNETS, ...SUPPORTED_TESTNETS]
			.map((c) => c.id)
			.includes(chainId)
	) {
		throw new Error(
			`Unsupported network with chain ID ${chainId}. Supported mainnets: ${SUPPORTED_MAINNETS.map((c) => c.creName).join(", ")}. Supported testnets: ${SUPPORTED_TESTNETS.map((c) => c.creName).join(", ")}.`,
		);
	}

	// const usdc = await viem.deployContract("testUSDC", [
	// 	BigInt(1_000_000_000 * 10 ** 6),
	// ]);

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

	await writeFiles(_network, deployment);

	return deployment;
}

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
	const argv = require("minimist")(process.argv.slice(2));

	if (!argv.network) {
		console.error("Please specify a network using --network");
		process.exit(1);
	}

	const deployment = await deploy(argv.network);

	writeFiles(argv.network, deployment);
}
