import { desc } from "drizzle-orm";
import { z } from "zod";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { buildWhereActive } from "../lib/db/utils/builders";
import { softCascade } from "../lib/db/utils/cascade";
import { requireAtLeastOne, safeQuery } from "../lib/db/utils/safe";
import { createGoogleCalendarEvent } from "../lib/utils/calendar";
import { ApiError } from "../lib/utils/hono/error";

const { sessions, meetings } = schema;

// Schemas
export const createMeetingInputSchema = z.object({
	sessionId: z.number().min(0, "Session ID is required"),
	summary: z
		.string()
		.min(1, "Summary must be at least 1 character")
		.max(255, "Summary must be less than 255 characters")
		.default("Verity Session"),
	startDate: z
		.date()
		.min(new Date(), "Start date must be in the future")
		.default(() => new Date(Date.now() + 5 * 60_000)),
	duration: z
		.number()
		.min(0.1, "Duration must be greater than 0")
		.max(60, "Duration must be less than 60 minutes")
		.default(1),
	attendees: z.array(z.email()),
});

export const getSessionMeetingsInputSchema = z.object({
	sessionId: z.coerce.number().optional(),
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(10),
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
export async function createMeeting(json: CreateMeetingInput) {
	const input = createMeetingInputSchema.parse(json);

	// Get Session
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

	// add host as attendee
	input.attendees.push(session.email);

	// Create Calendar Event
	const event = await createGoogleCalendarEvent(
		input.startDate,
		input.duration,
		input.summary,
		input.attendees
	);
	const meetingUrl = event.hangoutLink;
	const eventLink = event.htmlLink;
	const startDate = event.start?.dateTime;
	const eventId = event.id;
	if (!(meetingUrl && startDate && eventId)) {
		throw new ApiError(
			500,
			"Something went wrong while creating the meeting.."
		);
	}

	// Create Meeting
	const [meeting] = await safeQuery(
		db
			.insert(meetings)
			.values({
				sessionId: session.id,
				eventId,
				meetingUrl,
				summary: input.summary,
				calendarLink: eventLink,
				startDate,
				duration: input.duration,
			})
			.returning()
	);
	if (!meeting) {
		throw new ApiError(500, "Failed to create the meeting..");
	}

	return {
		meetingUrl: meeting.meetingUrl,
		sessionPrice: session.price,
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
			.limit(limit)
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
				buildWhereActive([{ table: meetings, filters: { id: meetingId } }])
			)
			.limit(1)
	);
	if (!result) {
		throw new ApiError(404, "Meeting not found");
	}
	return result;
}

export async function deleteMeeting(params: DeleteMeetingInput) {
	const { meetingId } = deleteMeetingInputSchema.parse(params);
	const result = await softCascade(db, meetings, meetingId, []);
	return result;
}
