import { describe, expect, it } from "bun:test";
import hre from "hardhat";
import { z } from "zod";
import { deploy } from "../scripts/deploy";
import { getContracts } from "../surface";
import { zEvmAddress } from "../workflows/shared/src";

const network = await hre.network.connect("test");
const [wallet1, wallet2] = await network.viem.getWalletClients();

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

	describe("Initiation Workflow", () => {
		it("can request a session", async () => {
			const tx = await contracts.Manager.write.requestSessionRegistration([
				wallet1.account.address,
				wallet2.account.address,
			]);
			const receipt = await tx.wait();
			expect(receipt.status).toBe(1);
		});
	});
});
