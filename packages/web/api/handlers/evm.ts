import { z } from "zod";
import { faucet } from "../lib/utils/evm";
import { zEvmAddress } from "../lib/utils/zod";

export const faucetInputSchema = z.object({
	address: zEvmAddress(),
});

export type FaucetInput = z.input<typeof faucetInputSchema>;

export async function requestFaucet(json: FaucetInput) {
	const input = faucetInputSchema.parse(json);
	const txHash = await faucet(input.address);
	return { txHash };
}
