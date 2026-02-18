import { google } from "googleapis";
import { getAuthenticatedClient } from "@/lib/utils/google";

export async function createGoogleCalendarEvent(summary: string) {
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

	return event.data;
}
