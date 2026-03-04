import "dotenv/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable, defineConfig } from "hardhat/config";

export default defineConfig({
	plugins: [hardhatToolboxViemPlugin],
	solidity: {
		profiles: {
			default: {
				version: "0.8.28",
			},
			production: {
				version: "0.8.28",
				settings: {
					optimizer: {
						enabled: true,
						runs: 200,
					},
				},
			},
		},
	},
	paths: {
		sources: "./src",
	},
	networks: {
		hardhat: {
			type: "http",
			chainType: "l1",
			url: "http://localhost:8545",
		},
		hardhatOp: {
			type: "edr-simulated",
			chainType: "op",
		},
		test: {
			type: "http",
			chainType: "l1",
			url: configVariable("TESTNET_RPC_URL"),
			accounts: [configVariable("TESTNET_PRIVATE_KEY")],
		},
	},
});
