import { describe, expect, it } from "bun:test";
import hre from "hardhat";
import { parseEventLogs } from "viem";
import { z } from "zod";
import { deploy } from "../scripts/deploy";
import { getContracts } from "../surface";
import { zEvmAddress } from "../workflows/shared/src";

const network = await hre.network.connect("test");
const [wallet1, _wallet2] = await network.viem.getWalletClients();
const publicClient = await network.viem.getPublicClient();

const testCid = "bafybeig6w5o3j5gwg7so4ntza6wxg52hixwavzzxm3zaavazpzm35lyeha";

const definitions = await deploy("test");
const deployedContractDefinitions = z
	.object({
		USDC: z.object({
			address: zEvmAddress(),
		}),
		KXManager: z.object({
			address: zEvmAddress(),
		}),
		KXSessionRegistry: z.object({
			address: zEvmAddress(),
		}),
	})
	.safeParse(definitions);
const contracts = getContracts("test", wallet1);

describe("E2E Test", () => {
	it("Contracts deploy", async () => {
		expect(deployedContractDefinitions.success).toBe(true);
		expect(contracts.USDC).toBeDefined();
		expect(contracts.Manager).toBeDefined();
		expect(contracts.SessionRegistry).toBeDefined();
	});

	describe("Listing", () => {
		it("register listing", async () => {
			const registerTx = await contracts.Manager.write.createListing([
				Bun.randomUUIDv7().toString(),
				100n,
			]);

			const registerTxReceipt = await publicClient.waitForTransactionReceipt({
				hash: registerTx,
			});

			const logs = parseEventLogs({
				logs: registerTxReceipt.logs,
				abi: contracts.Manager.abi,
			});

			const log = logs.find((log) => log.eventName === "ListingUpsert");
			if (!log || log.eventName !== "ListingUpsert") {
				throw new Error("ListingUpsert event not found");
			}

			const { dataCID, index } = log.args;

			expect(dataCID).toBe(testCid);
			expect(index).toBe(0n);
		});
	});
});
