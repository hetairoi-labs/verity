import axios from "axios";
import { env } from "@/lib/utils/env";
import type {
	Bot,
	Transcript,
	TranscriptArtifact,
} from "../../types/bot.types";
import { AxiosClient } from "../axios";

const botClient = new AxiosClient(env.RECALL_API_URL, {
	authorization: env.RECALL_API_KEY,
	accept: "application/json",
	"content-type": "application/json",
});

const RETENTION_HOURS = 160;
const LIVE_URL = `${env.PUBLIC_LIVE_APP_URL}/live`;

export function createBot(meetingUrl: string) {
	if (process.env.NODE_ENV === "production") {
		console.log("Creating production bot");
		return botClient.post<Bot>("/bot", {
			meeting_url: meetingUrl,
			bot_name: "Kex Bot",
			join_at: new Date(Date.now() + 0.5 * 60_000).toISOString(),
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
				include_bot_in_recording: {
					audio: true,
				},
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

	console.log("Creating bot for testing");
	return botClient.post<Bot>("/bot", {
		meeting_url: meetingUrl,
		bot_name: "Kex Bot (Ephemeral)",
		join_at: new Date(Date.now() + 0.1 * 60_000).toISOString(),
		recording_config: {
			retention: {
				type: "timed",
				hours: 1,
			},
		},
	});
}

export function retrieveBot(botId: string) {
	return botClient.get<Bot>(`/bot/${botId}`);
}

export function retrieveTranscript(transcriptId: string) {
	return botClient.get<TranscriptArtifact>(`/transcript/${transcriptId}/`);
}

export async function downloadTranscript(transcriptUrl: string) {
	const response = await axios.get<Transcript>(transcriptUrl);
	return response.data;
}

export function removeBotFromCall(botId: string) {
	return botClient.post(`/bot/${botId}/leave_call/`);
}

export function deleteRecording(recordingId: string) {
	return botClient.delete(`/recording/${recordingId}/`);
}
