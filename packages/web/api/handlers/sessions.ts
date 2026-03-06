import { definitions, zListingData } from "@verity/contracts";
import { desc } from "drizzle-orm";
import { parseEventLogs } from "viem";
import { z } from "zod";
import { safeAsync } from "@/lib/utils/safe";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { buildWhereActive } from "../lib/db/utils/builders";
import { softCascade } from "../lib/db/utils/cascade";
import { requireAtLeastOne, safeQuery } from "../lib/db/utils/safe";
import { publicClient } from "../lib/utils/evm";
import { ApiError } from "../lib/utils/hono/error";
import { zHex, zJsonString } from "../lib/utils/zod";
import { createGoalInputSchema } from "./goals";

const { sessions, meetings, goals, participants } = schema;

const sessionMetadataSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
});

export const createSessionRecordInputSchema = z.object({
	listingIndex: z.number(),
	title: z.string().min(1, "Title is required"),
	topic: z.string().min(1, "Topic is required"),
	description: z.string().optional(),
	price: z.number().min(0, "Price in USDC must be greater than 0"),
	goals: z
		.array(createGoalInputSchema.omit({ sessionId: true }))
		.min(1, "At least one goal is required")
		.optional(),
});

// Schemas
export const createSessionInputSchema = z
	.object({
		txHash: zHex(),
	})
	.extend(zListingData().shape);

export const getAllSessionsInputSchema = z.object({
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(10),
});

export const getSessionByIdInputSchema = z.object({
	sessionId: z.number().min(1, "Session ID is required"),
});

export const deleteSessionInputSchema = z.object({
	sessionId: z.number().min(1, "Session ID is required"),
});
export const getSessionTranscriptsInputSchema = z.object({
	sessionId: z.number().min(1, "Session ID is required"),
});

// Types
export type CreateSessionInput = z.input<typeof createSessionInputSchema>;
export type CreateSessionRecordInput = z.input<
	typeof createSessionRecordInputSchema
>;
export type GetAllSessionsInput = z.input<typeof getAllSessionsInputSchema>;
export type GetSessionByIdInput = z.input<typeof getSessionByIdInputSchema>;
export type DeleteSessionInput = z.input<typeof deleteSessionInputSchema>;
export type GetSessionTranscriptsInput = z.input<
	typeof getSessionTranscriptsInputSchema
>;

export function createSessionRecord(
	input: CreateSessionRecordInput,
	hostId: string
) {
	const parsed = createSessionRecordInputSchema.parse(input);

	return db.transaction(async (tx) => {
		const [sessionResult] = await safeQuery(
			tx
				.insert(sessions)
				.values({
					listingIndex: parsed.listingIndex,
					title: parsed.title,
					description: parsed.description,
					price: parsed.price.toString(),
					topic: parsed.topic,
					hostId,
				})
				.returning()
		);
		if (!sessionResult) {
			throw new ApiError(500, "Failed to create session..");
		}

		// Add host as participant
		const [participantResult] = await safeQuery(
			tx
				.insert(participants)
				.values({
					sessionId: sessionResult.id,
					userId: hostId,
					role: "host",
				})
				.returning()
		);
		if (!participantResult) {
			throw new ApiError(500, "Failed to add host as participant..");
		}

		// Create goals
		if (parsed.goals) {
			for (const goal of parsed.goals) {
				const [goalResult] = await safeQuery(
					tx
						.insert(goals)
						.values({
							...goal,
							sessionId: sessionResult.id,
						})
						.returning()
				);
				if (!goalResult) {
					throw new ApiError(500, "Failed to create goal..");
				}
			}
		}

		return sessionResult;
	});
}

// Handlers
export async function createSession(json: CreateSessionInput, hostId: string) {
	const input = createSessionInputSchema.parse(json);
	const [receipt, receiptError] = await safeAsync(
		publicClient.waitForTransactionReceipt({
			hash: input.txHash,
		})
	);

	if (receiptError) {
		throw new ApiError(500, "Failed to get transaction receipt", {
			reason: receiptError.message,
		});
	}

	const logs = parseEventLogs({
		abi: definitions.test.KXManager.abi,
		logs: receipt.logs,
		eventName: "ListingUpsert",
	});
	const listingIndex = logs[0]?.args.index;

	if (listingIndex === undefined) {
		throw new ApiError(500, "ListingUpsert event not found in transaction");
	}

	const metadata = sessionMetadataSchema.parse(
		zJsonString().parse(input.metadata)
	);

	return createSessionRecord(
		{
			listingIndex: Number(listingIndex),
			title: metadata.title,
			description: metadata.description,
			topic: input.topic,
			price: input.price,
			goals: input.goals.map((goal) => ({
				name: goal.name,
				weightage: goal.weight,
			})),
		},
		hostId
	);
}

export async function getAllSessions(
	params: GetAllSessionsInput,
	hostId?: string
) {
	const { page = 1, limit = 10 } = getAllSessionsInputSchema.parse(params);
	const offset = (page - 1) * limit;

	const result = await safeQuery(
		db
			.select()
			.from(sessions)
			.where(buildWhereActive([{ table: sessions, filters: { hostId } }]))
			.orderBy(desc(sessions.createdAt))
			.limit(limit)
			.offset(offset)
	);
	return result;
}

export async function getSessionById(params: GetSessionByIdInput) {
	const { sessionId } = getSessionByIdInputSchema.parse(params);
	requireAtLeastOne({ sessionId }, "Session ID is required");

	const [result] = await safeQuery(
		db
			.select()
			.from(sessions)
			.where(
				buildWhereActive([{ table: sessions, filters: { id: sessionId } }])
			)
	);
	if (!result) {
		throw new ApiError(404, "Session not found");
	}
	return result;
}

export async function deleteSession(
	params: DeleteSessionInput,
	hostId: string
) {
	const { sessionId } = deleteSessionInputSchema.parse(params);

	const session = await getSessionById({ sessionId });
	if (session.hostId !== hostId) {
		throw new ApiError(403, "Unauthorized");
	}

	const result = await softCascade(db, sessions, sessionId, [
		{ table: meetings, foreignKeyField: meetings.sessionId },
		{ table: participants, foreignKeyField: participants.sessionId },
		{ table: goals, foreignKeyField: goals.sessionId },
	]);
	if (!result.row) {
		throw new ApiError(404, "Session not found");
	}
	return { session: result.row };
}
