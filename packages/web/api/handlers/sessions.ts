import { definitions, zListingData } from "@verity/contracts";
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { parseEventLogs } from "viem";
import { z } from "zod";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { isoNow } from "../lib/db/utils";
import { buildWhereActive } from "../lib/db/utils/builders";
import { softCascade } from "../lib/db/utils/cascade";
import { requireAtLeastOne, safeQuery } from "../lib/db/utils/safe";
import { waitForReceipt } from "../lib/utils/evm";
import { ApiError } from "../lib/utils/hono/error";
import { logger } from "../lib/utils/pino";
import { zHex } from "../lib/utils/zod";
import { createGoalInputSchema } from "./goals";

const { sessions, meetings, goals, participants } = schema;

export const listingWithMetadataSchema = zListingData()
	.omit({
		metadata: true,
	})
	.extend({
		metadata: z.object({
			title: z.string().min(1, "Title is required"),
			description: z.string().optional(),
			email: z.email("Invalid email address"),
		}),
	});

export type ListingWithMetadata = z.input<typeof listingWithMetadataSchema>;
export const createSessionRecordInputSchema = z.object({
	index: z.number(),
	cid: z.string(),
	title: z.string().min(1, "Title is required"),
	topic: z.string().min(1, "Topic is required"),
	description: z.string().optional(),
	email: z.email("Invalid email address"),
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
	.extend(listingWithMetadataSchema.shape);
export const updateSessionInputSchema = createSessionInputSchema;

export const getAllSessionsInputSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
});

export const getSessionByIdInputSchema = z.object({
	sessionId: z.coerce.number().min(0, "Session ID is required"),
});
export const enrollParticipantInputSchema = z.object({
	sessionId: z.coerce.number().min(0, "Session ID is required"),
	txHash: zHex(),
});
export const getSessionHistoryInputSchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
});

export const deleteSessionInputSchema = z.object({
	sessionId: z.coerce.number().min(0, "Session ID is required"),
});
export const getSessionTranscriptsInputSchema = z.object({
	sessionId: z.coerce.number().min(0, "Session ID is required"),
});

// Types
export type CreateSessionInput = z.input<typeof createSessionInputSchema>;
export type UpdateSessionInput = z.input<typeof updateSessionInputSchema>;
export type CreateSessionRecordInput = z.input<
	typeof createSessionRecordInputSchema
>;
export type GetAllSessionsInput = z.input<typeof getAllSessionsInputSchema>;
export type GetSessionByIdInput = z.input<typeof getSessionByIdInputSchema>;
export type EnrollParticipantInput = z.input<
	typeof enrollParticipantInputSchema
>;
export type GetSessionHistoryInput = z.input<
	typeof getSessionHistoryInputSchema
>;
export type DeleteSessionInput = z.input<typeof deleteSessionInputSchema>;
export type GetSessionTranscriptsInput = z.input<
	typeof getSessionTranscriptsInputSchema
>;

// Helpers
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
					id: parsed.index,
					cid: parsed.cid,
					title: parsed.title,
					email: parsed.email,
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
	const receipt = await waitForReceipt(input.txHash);

	const logs = parseEventLogs({
		abi: definitions.test.KXManager.abi,
		logs: receipt.logs,
		eventName: "ListingUpsert",
	});
	const listingIndex = logs[0]?.args;
	if (
		listingIndex?.index === undefined ||
		listingIndex?.dataCID === undefined
	) {
		throw new ApiError(500, "No listing index or data CID found in logs");
	}

	const session = await createSessionRecord(
		{
			index: Number(listingIndex.index),
			cid: listingIndex.dataCID,
			title: input.metadata.title,
			email: input.metadata.email,
			description: input.metadata.description,
			topic: input.topic,
			price: input.price,
			goals: input.goals.map((goal) => ({
				name: goal.name,
				weightage: goal.weight,
			})),
		},
		hostId
	);
	if (!session) {
		throw new ApiError(500, "Failed to create session..");
	}

	logger.info({ session }, "session.create.success");
	return session;
}

export async function updateSession(json: UpdateSessionInput, hostId: string) {
	const input = updateSessionInputSchema.parse(json);
	const receipt = await waitForReceipt(input.txHash);

	const logs = parseEventLogs({
		abi: definitions.test.KXManager.abi,
		logs: receipt.logs,
		eventName: "ListingUpsert",
	});
	const listing = logs[0]?.args;
	if (listing?.index === undefined || listing?.dataCID === undefined) {
		throw new ApiError(500, "No listing index or data CID found in logs");
	}

	const nextGoals = input.goals.map((goal) => ({
		name: goal.name,
		weightage: goal.weight,
	}));
	const nextIndex = Number(listing.index);
	const nextCid = listing.dataCID;

	return db.transaction(async (tx) => {
		const [existingSession] = await safeQuery(
			tx
				.select()
				.from(sessions)
				.where(
					buildWhereActive([
						{ table: sessions, filters: { id: nextIndex, hostId } },
					])
				)
				.limit(1)
		);
		if (!existingSession) {
			throw new ApiError(404, "Session not found");
		}

		const [updatedSession] = await safeQuery(
			tx
				.update(sessions)
				.set({
					cid: nextCid,
					title: input.metadata.title,
					email: input.metadata.email,
					description: input.metadata.description,
					topic: input.topic,
					price: input.price.toString(),
					updatedAt: isoNow(),
				})
				.where(
					buildWhereActive([
						{ table: sessions, filters: { id: existingSession.id, hostId } },
					])
				)
				.returning()
		);
		if (!updatedSession) {
			throw new ApiError(500, "Failed to update session");
		}

		const now = isoNow();
		await safeQuery(
			tx
				.update(goals)
				.set({
					deletedAt: now,
					updatedAt: now,
				})
				.where(
					buildWhereActive([
						{ table: goals, filters: { sessionId: existingSession.id } },
					])
				)
		);

		for (const goal of nextGoals) {
			const [goalResult] = await safeQuery(
				tx
					.insert(goals)
					.values({
						...goal,
						sessionId: existingSession.id,
					})
					.returning()
			);
			if (!goalResult) {
				throw new ApiError(500, "Failed to update goals");
			}
		}

		logger.info({ session: updatedSession }, "session.update.success");
		return updatedSession;
	});
}

export async function getAllSessions(
	params: GetAllSessionsInput,
	hostId?: string
) {
	const { page = 1, limit = 10 } = getAllSessionsInputSchema.parse(params);
	const offset = (page - 1) * limit;

	const result = await safeQuery(
		db
			.select({ id: sessions.id })
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

	const [meetingCountResult] = await safeQuery(
		db
			.select({ meetingsCount: sql<number>`count(*)` })
			.from(meetings)
			.where(
				buildWhereActive([
					{ table: meetings, filters: { sessionId: result.id } },
				])
			)
	);

	const sessionGoals = await safeQuery(
		db
			.select()
			.from(goals)
			.where(buildWhereActive([{ table: goals, filters: { sessionId } }]))
			.orderBy(desc(goals.createdAt))
	);

	return {
		...result,
		meetingsCount: Number(meetingCountResult?.meetingsCount ?? 0),
		goals: sessionGoals,
	};
}

export async function enrollParticipant(
	params: EnrollParticipantInput,
	userId: string
) {
	const input = enrollParticipantInputSchema.parse(params);
	const receipt = await waitForReceipt(input.txHash);

	if (receipt.status !== "success") {
		throw new ApiError(400, "Transaction was not successful");
	}

	const events = parseEventLogs({
		abi: definitions.test.KXManager.abi,
		logs: receipt.logs,
		eventName: "SessionRegistrationRequested",
	});
	const matchedEvent = events.find(
		(event) => Number(event.args.listingIndex) === input.sessionId
	);
	if (!matchedEvent) {
		throw new ApiError(400, "Transaction does not match this session");
	}

	const [session] = await safeQuery(
		db
			.select()
			.from(sessions)
			.where(
				buildWhereActive([
					{ table: sessions, filters: { id: input.sessionId } },
				])
			)
			.limit(1)
	);
	if (!session) {
		throw new ApiError(404, "Session not found");
	}

	const [existingParticipant] = await safeQuery(
		db
			.select()
			.from(participants)
			.where(
				buildWhereActive([
					{
						table: participants,
						filters: { sessionId: input.sessionId, userId },
					},
				])
			)
			.limit(1)
	);
	if (existingParticipant) {
		return existingParticipant;
	}

	const [participant] = await safeQuery(
		db
			.insert(participants)
			.values({
				sessionId: input.sessionId,
				userId,
				role: "participant",
				status: "active",
			})
			.returning()
	);
	if (!participant) {
		throw new ApiError(500, "Failed to enroll participant");
	}

	return participant;
}

export function getSessionHistory(
	params: GetSessionHistoryInput,
	userId: string
) {
	const { page, limit } = getSessionHistoryInputSchema.parse(params);
	const offset = (page - 1) * limit;

	return safeQuery(
		db
			.select({
				id: sessions.id,
				cid: sessions.cid,
				title: sessions.title,
				email: sessions.email,
				description: sessions.description,
				topic: sessions.topic,
				price: sessions.price,
				hostId: sessions.hostId,
				createdAt: sessions.createdAt,
				updatedAt: sessions.updatedAt,
				participantRole: participants.role,
				participantStatus: participants.status,
				enrolledAt: participants.createdAt,
			})
			.from(participants)
			.innerJoin(sessions, eq(sessions.id, participants.sessionId))
			.where(
				and(
					eq(participants.userId, userId),
					ne(participants.role, "host"),
					sql`${participants.deletedAt} IS NULL`,
					sql`${sessions.deletedAt} IS NULL`
				)
			)
			.orderBy(desc(participants.createdAt))
			.limit(limit)
			.offset(offset)
	);
}

export async function getDashboardMetrics(hostId: string) {
	const [listingsResult] = await safeQuery(
		db
			.select({ totalListings: sql<number>`count(*)` })
			.from(sessions)
			.where(buildWhereActive([{ table: sessions, filters: { hostId } }]))
	);

	const [meetingsResult] = await safeQuery(
		db
			.select({ totalMeetings: sql<number>`count(*)` })
			.from(meetings)
			.innerJoin(sessions, eq(sessions.id, meetings.sessionId))
			.where(
				and(
					eq(sessions.hostId, hostId),
					sql`${sessions.deletedAt} IS NULL`,
					sql`${meetings.deletedAt} IS NULL`
				)
			)
	);

	const [earningsResult] = await safeQuery(
		db
			.select({
				totalEarningsUSDC: sql<number>`coalesce(sum(cast(${sessions.price} as REAL)), 0)`,
				averagePriceUSDC: sql<number>`coalesce(avg(cast(${sessions.price} as REAL)), 0)`,
			})
			.from(sessions)
			.where(buildWhereActive([{ table: sessions, filters: { hostId } }]))
	);

	return {
		totalListings: Number(listingsResult?.totalListings ?? 0),
		totalMeetings: Number(meetingsResult?.totalMeetings ?? 0),
		totalEarningsUSDC: Number(earningsResult?.totalEarningsUSDC ?? 0),
		averagePriceUSDC: Number(earningsResult?.averagePriceUSDC ?? 0),
	};
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
