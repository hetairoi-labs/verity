import axios from "axios";
import type { Bot, Transcript } from "../types/bot.types";
import { AxiosClient } from "./axios";

const botClient = new AxiosClient(process.env.RECALL_API_URL, {
	authorization: process.env.RECALL_API_KEY,
	accept: "application/json",
	"content-type": "application/json",
});

const RETENTION_HOURS = 160;
const LIVE_URL = `${process.env.PUBLIC_APP_URL}/live`;

export async function createBot(meetingUrl: URL) {
	return botClient.post<Bot>("/bot", {
		meeting_url: meetingUrl.href,
		bot_name: "Kex Bot",
		variant: {
			zoom: "web_4_core",
			google_meet: "web_4_core",
			microsoft_teams: "web_4_core",
		},
		output_media: {
			camera: {
				kind: "webpage",
				config: {
					url: LIVE_URL,
				},
			},
		},
		recording_config: {
			retention: {
				type: "timed",
				hours: RETENTION_HOURS,
			},
			transcript: {
				provider: {
					recallai_streaming: {
						mode: "prioritize_accuracy",
					},
				},
			},
		},
	});
}

export async function retrieveBot(botId: string) {
	return botClient.get<Bot>(`/bot/${botId}`);
}

export async function downloadTranscript(transcriptUrl: URL) {
	const response = await axios.get<Transcript>(transcriptUrl.href);
	return response.data;
}

export async function deleteRecording(recordingId: string) {
	return botClient.delete(`/recording/${recordingId}/`);
}
