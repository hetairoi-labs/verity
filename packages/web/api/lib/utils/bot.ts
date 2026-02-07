export function processAudioChunk(audioBuffer: Uint8Array) {
	console.log("Processing audio chunk:", audioBuffer);
}

export async function createBot(meetingUrl: URL) {
	console.log("Creating bot for meeting:", meetingUrl);

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
		}),
	});

	if (!response.ok) {
		throw new Error(`Error: ${response.status} ${response.statusText}`);
	}

	return response.json();
}
