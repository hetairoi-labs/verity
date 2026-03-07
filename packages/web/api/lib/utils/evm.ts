import { getContracts } from "@verity/contracts";
import { createPublicClient, createWalletClient, http } from "viem";
import { type Address, privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { env } from "@/lib/utils/env";
import { safeAsync } from "@/lib/utils/safe";
import { ApiError } from "./hono/error";

export const publicClient = createPublicClient({
	chain: sepolia,
	transport: http(),
});

export const walletClient = createWalletClient({
	chain: sepolia,
	transport: http(),
	account: privateKeyToAccount(env.TESTNET_PRIVATE_KEY),
});

export const contracts = getContracts("test", walletClient);

export async function waitForReceipt(hash: `0x${string}`) {
	const [receipt, receiptError] = await safeAsync(
		publicClient.waitForTransactionReceipt({
			hash,
		})
	);

	if (receiptError) {
		throw new ApiError(500, "Failed to get transaction receipt", {
			reason: receiptError.message,
		});
	}

	return receipt;
}

export async function faucet(address: Address) {
	const amount = 1_000_000_00n;
	const txHash = await contracts.USDC.write.transfer([address, amount]);
	return txHash;
}
