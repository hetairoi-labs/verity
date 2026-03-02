import { describe, expect, it } from "bun:test";
import { z } from "zod";
import { deploy } from "../scripts/deploy";
import { zEvmAddress } from "../workflows/shared/src";
import { getContracts } from "../surface";
import hre from "hardhat";

const network = await hre.network.connect("test");
const [wallet1, wallet2] = await network.viem.getWalletClients();
let contracts: ReturnType<typeof getContracts>;

describe("E2E Test", () => {
	it("Contracts deploy", async () => {
		const definitions = await deploy("test");
		const result = z
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
		expect(result.success).toBe(true);

		contracts = getContracts("test", wallet1);
	});
});
