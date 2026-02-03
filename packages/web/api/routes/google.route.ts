import { google } from "googleapis";
import { Hono } from "hono";
import { respond } from "@/api/lib/utils/respond";
import { getAuthenticatedClient } from "@/utils/google";

const googleRoute = new Hono().post("/create-meeting", async (ctx) => {
	try {
		const client = await getAuthenticatedClient();
		const calendar = google.calendar({ version: "v3", auth: client });

		const event = await calendar.events.insert({
			calendarId: "primary",
			conferenceDataVersion: 1,
			requestBody: {
				summary: "Test meeting",
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
			ctx,
			{ event: event.data.hangoutLink },
			"Meeting created successfully! 🎉",
			200,
		);
	} catch (error) {
		console.error(error);
		return respond.err(
			ctx,
			"Internal Server Error: Failed to create meeting! 🎉",
			500,
		);
	}
});

export default googleRoute;
export type GoogleType = typeof googleRoute;
