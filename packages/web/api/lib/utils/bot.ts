import { getWsUrl } from "./ws";

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
			recording_config: {
				video_mixed_layout: "gallery_view_v2",
				video_separate_mp4: {},
			},
			audio_separate_raw: {},
			realtime_endpoints: [
				{
					type: "websocket",
					url: `${wsUrl}/stream`,
					events: ["audio_separate_raw.data"],
				},
			],
		}),
	});

	if (!response.ok) {
		throw new Error(`Error: ${response.status} ${response.statusText}`);
	}

	const data = await response.json();
	return data;
}
