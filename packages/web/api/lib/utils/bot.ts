import { ApiError } from "./hono/server-error";
import { getWsUrl } from "./hono/ws";

export function processAudioChunk(audioBuffer: Uint8Array) {
	console.log("Processing audio chunk:", audioBuffer);
}

export async function createBot(meetingUrl: URL) {
	const wsUrl = getWsUrl();
	console.log("WS URL:", wsUrl);

	const response = await fetch(`${process.env.RECALL_API_URL}/bot`, {
		method: "POST",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			authorization: process.env.RECALL_API_KEY,
		},
		body: JSON.stringify({
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
						url: `${process.env.PUBLIC_APP_URL}/live`,
					},
				},
			},
			recording_config: {
				transcript: {
					provider: {
						recallai_streaming: {
							mode: "prioritize_accuracy",
						},
					},
				},
			},
		}),
	});

	if (!response.ok) {
		throw new ApiError(
			400,
			`Bot Creation Error: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data;
}
