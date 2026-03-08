import {
	consensusIdenticalAggregation,
	cre,
	type HTTPSendRequester,
	ok,
	type Runtime,
} from "@chainlink/cre-sdk";
import {
	type zConfig,
	zRecallBotCreationResponse,
	zRecallTranscriptResponse,
} from "./zod";
import type z from "zod";

type RecallTranscriptResponse = {
	raw: string;
};
type RecallBotCreationResponse = {
	transcriptId: string;
};

const RETENTION_HOURS = 160;

export const getRecallTranscript = (
	runtime: Runtime<z.infer<ReturnType<typeof zConfig>>>,
	recallBotId: string,
): RecallTranscriptResponse => {
	const apiBaseUrl = runtime.getSecret({ id: "RECALL_API_BASE_URL" }).result();
	const apiKey = runtime.getSecret({ id: "RECALL_API_KEY" }).result();

	const httpClient = new cre.capabilities.HTTPClient();

	const result = httpClient
		.sendRequest(
			runtime,
			GetRecallTranscriptData(
				`${apiBaseUrl.value}/bot/${recallBotId}/transcript/`,
				apiKey.value,
			),
			consensusIdenticalAggregation<RecallTranscriptResponse>(),
		)(runtime.config)
		.result();

	return result;
};

const GetRecallTranscriptData =
	(transcriptUrl: string, apiKey: string) =>
	(
		sendRequester: HTTPSendRequester,
		_config: z.infer<ReturnType<typeof zConfig>>,
	): RecallTranscriptResponse => {
		const req: Parameters<typeof sendRequester.sendRequest>[0] = {
			url: transcriptUrl,
			headers: {
				Authorization: `Token ${apiKey}`,
				"Content-Type": "application/json",
			},
			method: "GET" as const,
			cacheSettings: {
				store: true,
				maxAge: "3600s",
			},
		};

		const resp = sendRequester.sendRequest(req).result();
		const bodyText = new TextDecoder().decode(resp.body);

		if (!ok(resp))
			throw new Error(
				`HTTP request failed with status: ${resp.statusCode}. Error: ${bodyText}`,
			);

		const parsedResponse = zRecallTranscriptResponse().parse(
			JSON.parse(bodyText),
		);

		return {
			raw: compressTranscript(parsedResponse),
		};
	};

export function compressTranscript(
	transcript: z.infer<ReturnType<typeof zRecallTranscriptResponse>>,
): string {
	const participantMap = new Map<
		string | number,
		{ name: string; isHost: boolean }
	>();
	for (const entry of transcript) {
		const id = entry.participant.id;
		if (!participantMap.has(id)) {
			const name =
				entry.participant.name?.trim() || `Speaker ${participantMap.size + 1}`;
			participantMap.set(id, {
				name,
				isHost: entry.participant.is_host ?? false,
			});
		}
	}

	const turns: { speaker: string; text: string; start?: number }[] = [];
	let lastSpeaker: string | null = null;

	for (const entry of transcript) {
		const participant = participantMap.get(entry.participant.id);
		const speaker = participant?.name ?? "Unknown";
		const rawText = entry.words.map((w) => w.text).join(" ");
		const text = rawText.replace(/\s+/g, " ").trim();
		if (!text) continue;

		const start = entry.words[0]?.start_timestamp?.relative;

		if (lastSpeaker === speaker) {
			const last = turns[turns.length - 1];
			if (last) {
				const ts = start != null ? ` [${Math.round(start)}s]` : "";
				last.text += `${ts} ${text}`;
			}
		} else {
			turns.push({ speaker, text, start });
			lastSpeaker = speaker;
		}
	}

	const dialogue = turns
		.map((t) => {
			const ts = t.start != null ? `[${Math.round(t.start)}s] ` : "";
			return `${ts}${t.speaker}: ${t.text}`;
		})
		.join("\n");

	const hostLine = [...participantMap.values()]
		.filter((p) => p.isHost)
		.map((p) => p.name)
		.join(", ");
	const header = hostLine ? `Meeting Hosts: ${hostLine}\n\n` : "";
	return header + dialogue;
}

export const createRecallBot = (
	runtime: Runtime<z.infer<ReturnType<typeof zConfig>>>,
	meetingUrl: string,
): RecallBotCreationResponse => {
	const apiKey = runtime.getSecret({ id: "RECALL_API_KEY" }).result();
	const liveUrl = runtime.getSecret({ id: "APP_LIVE_URL" }).result();
	const apiBaseUrl = runtime.getSecret({ id: "RECALL_API_BASE_URL" }).result();

	const httpClient = new cre.capabilities.HTTPClient();

	const result = httpClient
		.sendRequest(
			runtime,
			CreateRecallBotData(
				meetingUrl,
				liveUrl.value,
				apiBaseUrl.value,
				apiKey.value,
			),
			consensusIdenticalAggregation<RecallBotCreationResponse>(),
		)(runtime.config)
		.result();

	return result;
};

const CreateRecallBotData =
	(meetingUrl: string, liveUrl: string, apiBaseUrl: string, apiKey: string) =>
	(
		sendRequester: HTTPSendRequester,
		_config: z.infer<ReturnType<typeof zConfig>>,
	): RecallBotCreationResponse => {
		const dataToSend = {
			meeting_url: meetingUrl,
			bot_name: "Verity Bot",
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
						url: liveUrl,
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
		};

		const bodyBytes = new TextEncoder().encode(JSON.stringify(dataToSend));
		const body = Buffer.from(bodyBytes).toString("base64");

		const req: Parameters<typeof sendRequester.sendRequest>[0] = {
			url: `${apiBaseUrl}/bot`,
			body: body,
			headers: {
				Authorization: `Token ${apiKey}`,
				"Content-Type": "application/json",
			},
			method: "POST" as const,
			cacheSettings: {
				store: false,
			},
		};

		const resp = sendRequester.sendRequest(req).result();
		const bodyText = new TextDecoder().decode(resp.body);

		if (!ok(resp))
			throw new Error(
				`HTTP request failed with status: ${resp.statusCode}. Error: ${bodyText}`,
			);

		const parsedResponse = zRecallBotCreationResponse().parse(
			JSON.parse(bodyText),
		);

		return {
			transcriptId: parsedResponse.id,
		};
	};
