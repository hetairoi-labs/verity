import type {
	ClientErrorStatusCode,
	ServerErrorStatusCode,
} from "hono/utils/http-status";
import { ApiError } from "./hono/server-error";

export async function createBot(meetingUrl: URL) {
	console.log("Creating bot for meeting:", meetingUrl.href);
	console.log("RECALL_API_URL:", process.env.RECALL_API_URL);
	console.log("RECALL_API_KEY:", process.env.RECALL_API_KEY);
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
			response.status as ClientErrorStatusCode | ServerErrorStatusCode,
			`Bot Creation Error: ${response.statusText}`,
		);
	}

	console.log("Bot created:", response.status);
	const data = await response.json();
	return data;
}

export type Recording = {
	id: string;
	media_shortcuts: {
		transcript: {
			id: string;
			data: {
				download_url: string;
			};
			provider: {
				recallai_streaming: object;
			};
		};
	};
};

export type Bot = {
	id: string;
	recordings: Recording[];
};

export async function retrieveBot(botId: string) {
	const response = await fetch(`${process.env.RECALL_API_URL}/bot/${botId}`, {
		method: "GET",
		headers: {
			authorization: process.env.RECALL_API_KEY,
			accept: "application/json",
		},
	});

	if (!response.ok) {
		throw new ApiError(
			400,
			`Bot Retrieval Error: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data as Bot;
}

export type Transcript = {
	participant: {
		id: string;
		name: string | null;
		is_host: boolean | null;
		platform: string | null;
		extra_data: Record<string, unknown> | null;
		email: string | null;
	};
	words: {
		text: string;
		start_timestamp: {
			absolute: string;
			relative: number;
		};
		end_timestamp: {
			absolute: string;
			relative: number;
		};
	};
}[];

export async function downloadTranscript(transcriptUrl: URL) {
	const response = await fetch(transcriptUrl.href, {
		method: "GET",
		headers: {
			authorization: process.env.RECALL_API_KEY,
			accept: "application/json",
		},
	});

	if (!response.ok) {
		throw new ApiError(
			400,
			`Transcript Download Error: ${response.status} ${response.statusText}`,
		);
	}

	const data = await response.json();
	return data as Transcript;
}
