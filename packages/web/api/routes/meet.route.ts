import { google } from "googleapis";
import { Hono } from "hono";
import { z } from "zod";
import {
	createBot,
	downloadTranscript,
	retrieveBot,
} from "@/api/lib/utils/bot";
import { respond } from "@/api/lib/utils/hono/respond";
import { getAuthenticatedClient } from "@/utils/google";
import { getGeminiEphemeralToken } from "../lib/utils/gemini";
import { ApiError } from "../lib/utils/hono/server-error";
import { validator } from "../lib/utils/zod";

const meetRoute = new Hono()
	.post(
		"/create-meeting-with-bot",
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
			const client = await getAuthenticatedClient();
			const calendar = google.calendar({ version: "v3", auth: client });

			const event = await calendar.events.insert({
				calendarId: "primary",
				conferenceDataVersion: 1,
				requestBody: {
					summary,
					start: { dateTime: new Date().toISOString() },
					end: { dateTime: new Date(Date.now() + 30 * 60_000).toISOString() },
					conferenceData: {
						createRequest: {
							requestId: crypto.randomUUID(),
							conferenceSolutionKey: { type: "hangoutsMeet" },
						},
					},
				},
			});

			if (!event.data.hangoutLink) {
				throw new ApiError(
					500,
					"Something went wrong while creating the meeting..",
				);
			}

			return respond.ok(c, 200, "Meeting created successfully", {
				event: event.data,
			});
		},
	)
	.post(
		"/create-bot",
		validator("json", z.object({ meetingUrl: z.url() })),
		async (c) => {
			const { meetingUrl } = c.req.valid("json");
			const bot = await createBot(new URL(meetingUrl));
			return respond.ok(c, 200, "Bot created successfully", {
				bot,
			});
		},
	)
	.get("/token", async (c) => {
		const token = await getGeminiEphemeralToken();
		return respond.ok(c, 200, "Gemini token retrieved successfully", {
			token,
		});
	})
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
