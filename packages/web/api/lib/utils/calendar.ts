import { google } from "googleapis";
import { getAuthenticatedClient } from "@/lib/utils/google";

export async function getGoogleEventData(eventId: string) {
	const client = await getAuthenticatedClient();
	const calendar = google.calendar({ version: "v3", auth: client });

	const response = await calendar.events.get({
		eventId,
	});

	return response.data;
}

export async function createGoogleCalendarEvent(
	startDate: Date,
	duration: number,
	summary?: string,
	attendees?: string[]
) {
	const client = await getAuthenticatedClient();
	const calendar = google.calendar({ version: "v3", auth: client });

	const event = await calendar.events.insert({
		calendarId: "primary",
		conferenceDataVersion: 1,
		requestBody: {
			summary,
			start: { dateTime: startDate.toISOString() },
			end: {
				dateTime: new Date(
					startDate.getTime() + duration * 60_000
				).toISOString(),
			},
			conferenceData: {
				createRequest: {
					requestId: crypto.randomUUID(),
					conferenceSolutionKey: { type: "hangoutsMeet" },
				},
			},
			attendees: attendees?.map((email) => ({ email })),
		},
	});

	return event.data;
}

export async function deleteGoogleCalendarEvent(eventId: string) {
	const client = await getAuthenticatedClient();
	const calendar = google.calendar({ version: "v3", auth: client });

	await calendar.events.delete({
		calendarId: "primary",
		eventId,
	});

	return { success: true };
}
