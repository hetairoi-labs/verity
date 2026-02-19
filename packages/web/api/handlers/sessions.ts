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
		.min(1, "Summary is required")
		.max(255, "Summary must be less than 255 characters")
		.default("Kex Session"),
	startDate: z
		.date()
		.min(new Date(), "Start date must be in the future")
		.default(new Date()),
	duration: z
		.number()
		.min(1, "Duration must be greater than 0")
		.max(60, "Duration must be less than 60 minutes")
		.default(5),
});
export type CreateSessionInput = z.infer<typeof createSessionInputSchema>;

export async function createSession(userId: string, json: CreateSessionInput) {
	const input = createSessionInputSchema.parse(json);
	const event = await createGoogleCalendarEvent(
		input.startDate,
		input.duration,
		input.summary,
	);
	const meetingUrl = event.hangoutLink;
	if (!meetingUrl) {
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
			.values({ userId, meetingUrl, botId, summary: input.summary })
			.returning(),
	);
	return {
		session,
		bot,
		event,
	};
}
