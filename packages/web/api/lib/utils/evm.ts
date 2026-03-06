import { createPublicClient, http } from "viem";
import { sepolia } from "viem/chains";
import { safeAsync } from "@/lib/utils/safe";
import { ApiError } from "./hono/error";

export const publicClient = createPublicClient({
	chain: sepolia,
	transport: http(),
});

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
