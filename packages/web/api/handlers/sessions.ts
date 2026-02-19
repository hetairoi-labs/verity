import { z } from "zod";
import { db } from "../lib/db";
import { schema } from "../lib/db/schema";
import { createBot } from "../lib/utils/bot";
import { createGoogleCalendarEvent } from "../lib/utils/google";
import { ApiError } from "../lib/utils/hono/error";
import { safeQuery } from "../lib/utils/safe";

const { sessions } = schema;

export const createSessionInputSchema = z.object({
	summary: z
		.string()
		.min(1, "Summary must be at least 1 character")
		.max(255, "Summary must be less than 255 characters")
		.default("Kex Session"),
	startDate: z
		.date()
		.min(new Date(), "Start date must be in the future")
		.default(() => new Date(Date.now() + 60000)), // 1 minute from now
	duration: z
		.number()
		.min(1, "Duration must be greater than 0")
		.max(60, "Duration must be less than 60 minutes")
		.default(5),
	botName: z
		.string()
		.min(3, "Bot name must be at least 1 character")
		.max(255, "Bot name must be less than 255 characters")
		.default("Kex Bot"),
});
export type CreateSessionInput = z.input<typeof createSessionInputSchema>;

export async function createSession(userId: string, json: CreateSessionInput) {
	const input = createSessionInputSchema.parse(json);
	const event = await createGoogleCalendarEvent(
		input.startDate,
		input.duration,
		input.summary,
	);
	const meetingUrl = event.hangoutLink;
	const eventLink = event.htmlLink;
	const startDate = event.start?.dateTime;
	if (!meetingUrl || !startDate) {
		throw new ApiError(
			500,
			"Something went wrong while creating the meeting..",
		);
	}
	const bot = await createBot(meetingUrl);
	const botId = bot.id;

	const [session] = await safeQuery(
		db
			.insert(sessions)
			.values({
				userId,
				meetingUrl,
				botId,
				summary: input.summary,
				eventLink,
				startDate,
			})
			.returning(),
	);
	return {
		session,
		bot,
		event,
	};
}
