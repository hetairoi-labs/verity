import { google } from "googleapis";
import { Hono } from "hono";
import { z } from "zod";
import { createBot } from "@/api/lib/utils/bot";
import { respond } from "@/api/lib/utils/hono/respond";
import { getAuthenticatedClient } from "@/utils/google";
import { validator } from "../lib/utils/zod";

const meetRoute = new Hono()
	.post(
		"/create-meeting",
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

			return respond.ok(c, 200, "Meeting created successfully! 🎉", {
				event: event.data,
			});
		},
	)
	.post(
		"/create-bot",
		validator(
			"json",
			z.object({
				meetingUrl: z.url("Invalid meeting URL"),
			}),
		),
		async (c) => {
			const { meetingUrl } = c.req.valid("json");
			const bot = await createBot(new URL(meetingUrl));
			return respond.ok(c, 200, "Bot created successfully! 🤖", { bot });
		},
	);

export default meetRoute;
export type MeetType = typeof meetRoute;
