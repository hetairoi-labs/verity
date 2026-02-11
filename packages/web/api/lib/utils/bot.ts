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
			meeting_url: meetingUrl,
			bot_name: "Kex Bot",
			output_media: {
				camera: {
					kind: "webpage",
					config: {
						url: "https://intemerately-unsardonic-ebonie.ngrok-free.dev/live",
					},
				},
			},
			recording_config: {
				transcript: {
					provider: {
						meeting_captions: {},
					},
				},
			},
		}),
	});

	if (!response.ok) {
		throw new ApiError(
			400,
			`Bot CreationError: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data;
}
