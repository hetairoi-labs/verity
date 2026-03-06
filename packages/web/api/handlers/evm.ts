import { definitions } from "@verity/contracts";
import { parseEventLogs } from "viem";
import z from "zod";
import { safeAsync } from "@/lib/utils/safe";
import { publicClient } from "../lib/utils/evm";
import { ApiError } from "../lib/utils/hono/error";
import { zHex, zJsonString } from "../lib/utils/zod";
import { createSession } from "./sessions";

export const upsertListingInputSchema = z.object({
	txHash: zHex(),
	metadata: z.string(),
	topic: z.string(),
	price: z.number(),
	goals: z.array(z.object({ name: z.string(), weight: z.number() })),
});

export type UpsertListingInput = z.input<typeof upsertListingInputSchema>;

export async function upsertListing(
	params: UpsertListingInput,
	hostId: string
) {
	const parsed = upsertListingInputSchema.parse(params);
	const [receipt, err] = await safeAsync(
		publicClient.waitForTransactionReceipt({
			hash: parsed.txHash,
		})
	);

	if (err) {
		throw new ApiError(500, "Failed to get transaction receipt", {
			reason: err.message,
		});
	}

	const abi = definitions.test.KXManager.abi;
	const logs = parseEventLogs({
		abi,
		logs: receipt.logs,
		eventName: "ListingUpsert",
	});

	// create db session
	const listingIndex = logs[0]?.args.index;
	const metadata = zJsonString().parse(parsed.metadata);

	console.log("listingIndex fetched", listingIndex);
	const session = await createSession(
		{
			listingIndex: Number(listingIndex),
			title: metadata.title,
			description: metadata.description,
			topic: parsed.topic,
			price: parsed.price,
			goals: parsed.goals,
		},
		hostId
	);
	console.log("session created", session);
	return session;
}
