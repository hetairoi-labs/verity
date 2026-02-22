import { desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { buildWhereActive } from "../lib/db/utils/builders";
import { softCascade } from "../lib/db/utils/cascade";
import { requireAtLeastOne, safeQuery } from "../lib/db/utils/safe";
import { createBot } from "../lib/utils/bot";
import { createGoogleCalendarEvent } from "../lib/utils/calendar";
import { ApiError } from "../lib/utils/hono/error";

const { sessions, meetings, goals } = schema;

// Schemas
export const createMeetingInputSchema = z.object({
	sessionId: z.number().min(1, "Session ID is required"),
	summary: z
		.string()
		.min(1, "Summary must be at least 1 character")
		.max(255, "Summary must be less than 255 characters")
		.default("Kex Session"),
	startDate: z
		.date()
		.min(new Date(), "Start date must be in the future")
		.default(() => new Date(Date.now())),
	duration: z
		.number()
		.min(0.1, "Duration must be greater than 0")
		.max(60, "Duration must be less than 60 minutes")
		.default(1),
	botName: z
		.string()
		.min(3, "Bot name must be at least 1 character")
		.max(255, "Bot name must be less than 255 characters")
		.default("Kex Bot"),
});

export const getSessionMeetingsInputSchema = z.object({
	sessionId: z.number().optional(),
	page: z.number().min(1).default(1),
	limit: z.number().min(1).max(100).default(10),
});

export const getMeetingByIdInputSchema = z.object({
	meetingId: z.number().min(1, "Meeting ID is required"),
});

export const deleteMeetingInputSchema = z.object({
	meetingId: z.number().min(1, "Meeting ID is required"),
});

// Types
export type CreateMeetingInput = z.input<typeof createMeetingInputSchema>;
export type GetSessionMeetingsInput = z.input<
	typeof getSessionMeetingsInputSchema
>;
export type GetMeetingByIdInput = z.input<typeof getMeetingByIdInputSchema>;
export type DeleteMeetingInput = z.input<typeof deleteMeetingInputSchema>;

// Handlers

export async function createMeeting(json: CreateMeetingInput, hostId: string) {
	const input = createMeetingInputSchema.parse(json);

	// Create Calendar Event
	const event = await createGoogleCalendarEvent(
		input.startDate,
		input.duration,
		input.summary,
	);
	const meetingUrl = event.hangoutLink;
	const eventLink = event.htmlLink;
	const startDate = event.start?.dateTime;
	const eventId = event.id;
	if (!meetingUrl || !startDate || !eventId) {
		throw new ApiError(
			500,
			"Something went wrong while creating the meeting..",
		);
	}

	// Create Bot
	const bot = await createBot(meetingUrl);
	const botId = bot.id;

	// Get Session
	const [session] = await safeQuery(
		db
			.select()
			.from(sessions)
			.where(
				buildWhereActive([
					{ table: sessions, filters: { id: input.sessionId, hostId } },
				]),
			)
			.limit(1),
	);
	if (!session) throw new ApiError(404, "Session not found");

	// Create Meeting
	const [meeting] = await safeQuery(
		db
			.insert(meetings)
			.values({
				sessionId: session.id,
				eventId,
				botId,
				meetingUrl,
				summary: input.summary,
				calendarLink: eventLink,
				startDate,
				duration: input.duration,
			})
			.returning(),
	);
	if (!meeting) throw new ApiError(500, "Failed to create the meeting..");

	return {
		meeting,
		bot,
		event,
	};
}

export async function getSessionMeetings(params: GetSessionMeetingsInput) {
	const {
		sessionId,
		page = 1,
		limit = 10,
	} = getSessionMeetingsInputSchema.parse(params);
	requireAtLeastOne({ sessionId }, "Session ID is required");
	const offset = (page - 1) * limit;

	const result = await safeQuery(
		db
			.select()
			.from(meetings)
			.where(buildWhereActive([{ table: meetings, filters: { sessionId } }]))
			.orderBy(desc(meetings.createdAt))
			.offset(offset)
			.limit(limit),
	);
	return result;
}

export async function getMeetingById(params: GetMeetingByIdInput) {
	const { meetingId } = getMeetingByIdInputSchema.parse(params);
	const [result] = await safeQuery(
		db
			.select()
			.from(meetings)
			.where(
				buildWhereActive([{ table: meetings, filters: { id: meetingId } }]),
			)
			.limit(1),
	);
	if (!result) throw new ApiError(404, "Meeting not found");
	return result;
}

export async function deleteMeeting(params: DeleteMeetingInput) {
	const { meetingId } = deleteMeetingInputSchema.parse(params);
	const result = await softCascade(db, meetings, meetingId, [
		{
			table: goals,
			foreignKeyField: goals.meetingId,
		},
	]);
	return result;
}
