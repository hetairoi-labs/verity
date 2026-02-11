import { google } from "googleapis";
import { Hono } from "hono";
import { z } from "zod";
import { createBot } from "@/api/lib/utils/bot";
import { respond } from "@/api/lib/utils/hono/respond";
import { getAuthenticatedClient } from "@/utils/google";
import { AppError } from "../lib/utils/hono/error";
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

			return respond.ok(
				c,
				{ event: event.data },
				"Meeting created successfully! 🎉",
				200,
			);
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
			return respond.ok(c, { bot }, "Bot created successfully! 🤖", 200);
		},
	)
	.post(
		"/test",
		validator(
			"json",
			z.object({
				email: z.email("Invalid email address"),
				age: z.coerce.number().min(18, "Age must be greater than 18"),
			}),
		),
		async (c) => {
			const { email, age } = c.req.valid("json");

			// 1. Test manual AppError (403 Forbidden)
			if (email.endsWith("@blocked.com")) {
				throw new AppError("This domain is blacklisted", 403, {
					reason: "Security policy",
					domain: "@blocked.com",
				});
			}

			// 2. Test unexpected crash (500 Internal Server Error)
			if (email === "crash@test.com") {
				throw new Error("Simulated database failure!", {
					cause: {
						code: "DATABASE_ERROR",
						message: "Database connection failed",
					},
				});
			}

			// 3. Success Path (200 OK)
			return respond.ok(
				c,
				{ user: { email, age } },
				"Test successful! 🚀",
				200,
			);
		},
	);

export default meetRoute;
export type MeetType = typeof meetRoute;
