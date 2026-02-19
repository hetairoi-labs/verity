import { Hono } from "hono";
import { z } from "zod";
import {
	createBot,
	downloadTranscript,
	retrieveBot,
} from "@/api/lib/utils/bot";
import { respond } from "@/api/lib/utils/hono/respond";
import { createGoogleCalendarEvent } from "../lib/utils/google";
import { ApiError } from "../lib/utils/hono/error";
import { validator } from "../lib/utils/zod";

const meetRoute = new Hono()
	.post(
		"/create",
		validator(
			"json",
			z.object({
				summary: z
					.string()
					.min(1, "Summary is required")
					.max(255, "Summary must be less than 255 characters"),
			}),
		),
		async (c) => {
			const { summary } = c.req.valid("json");
			const event = await createGoogleCalendarEvent(summary);
			if (!event.hangoutLink) {
				throw new ApiError(
					500,
					"Something went wrong while creating the meeting..",
				);
			}
			const bot = await createBot(new URL(event.hangoutLink));

			return respond.ok(c, 200, "Meeting created successfully", {
				event,
				bot,
			});
		},
	)
	.get(
		"/bot",
		validator(
			"query",
			z.object({ botId: z.string().min(1, "Bot ID is required") }),
		),
		async (c) => {
			const { botId } = c.req.valid("query");
			const bot = await retrieveBot(botId);
			return respond.ok(c, 200, "Bot retrieved successfully", {
				bot,
			});
		},
	)
	.get(
		"/transcript",
		validator("query", z.object({ transcriptUrl: z.url() })),
		async (c) => {
			const { transcriptUrl } = c.req.valid("query");
			const transcript = await downloadTranscript(new URL(transcriptUrl));
			return respond.ok(c, 200, "Transcript downloaded successfully", {
				transcript,
			});
		},
	);

export default meetRoute;
export type MeetType = typeof meetRoute;
