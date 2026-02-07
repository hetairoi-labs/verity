import { zValidator } from "@hono/zod-validator";
import { google } from "googleapis";
import { Hono } from "hono";
import { z } from "zod";
import { createBot } from "@/api/lib/utils/bot";
import { respond } from "@/api/lib/utils/respond";
import { getAuthenticatedClient } from "@/utils/google";

const meetRoute = new Hono()
	.post(
		"/create-meeting",
		zValidator(
			"json",
			z.object({
				summary: z.string().min(1, "Summary is required"),
			}),
		),
		async (c) => {
			try {
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

				return respond.ok(
					c,
					{ event: event.data },
					"Meeting created successfully! 🎉",
					200,
				);
			} catch (error) {
				console.error(error);
				return respond.err(
					c,
					"Internal Server Error: Failed to create meeting",
					500,
				);
			}
		},
	)
	.post(
		"/create-bot",
		zValidator(
			"json",
			z.object({
				meetingUrl: z.url(),
			}),
		),
		async (c) => {
			try {
				const { meetingUrl } = c.req.valid("json");
				const bot = await createBot(new URL(meetingUrl));
				return respond.ok(c, { bot }, "Bot created successfully! 🤖", 200);
			} catch (error) {
				console.error(error);
				return respond.err(
					c,
					"Internal Server Error: Failed to create bot",
					500,
				);
			}
		},
	);

export default meetRoute;
export type MeetType = typeof meetRoute;
