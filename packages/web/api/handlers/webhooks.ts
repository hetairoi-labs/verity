import { safe } from "@/lib/utils/safe";
import { db } from "../lib/db";
import { buildWhereActive } from "../lib/db/utils/builders";
import { ApiError } from "../lib/utils/hono/error";
import { schema } from "../lib/db/schema";
import { safeQuery } from "../lib/db/utils/safe";
import type { TranscriptSchema } from "../lib/types/webhook.types";
import {
	downloadTranscript,
	retrieveTranscript,
} from "../lib/utils/recall/bot";
import {
	compressTranscript,
	saveTranscript,
} from "../lib/utils/recall/transcript";

const { meetings } = schema;
export async function handleTranscriptDone(payload: TranscriptSchema) {
	const [existingMeeting] = await safeQuery(
		db
			.select({
				transcriptStatus: meetings.transcriptStatus,
			})
			.from(meetings)
			.where(
				buildWhereActive([
					{ table: meetings, filters: { botId: payload.data.bot.id } },
				]),
			)
			.limit(1),
	);
	if (!existingMeeting) throw new ApiError(404, "Meeting not found");
	if (existingMeeting.transcriptStatus === "done") return;

	const transcript = await retrieveTranscript(payload.data.transcript.id);
	const transcriptUrl = transcript.data.download_url;

	if (!transcriptUrl) throw new ApiError(502, "Transcript URL not found");
	const downloadedTranscript = await downloadTranscript(transcriptUrl);
	const processedTranscript = compressTranscript(downloadedTranscript);

	const [_, error] = safe(() => {
		saveTranscript(
			`${payload.data.transcript.id}-raw`,
			JSON.stringify(downloadedTranscript),
		);
		saveTranscript(
			`${payload.data.transcript.id}-compressed`,
			processedTranscript,
		);
	});
	if (error)
		throw new ApiError(
			500,
			`Failed to save transcripts for transcript id: ${payload.data.transcript.id}: ${error.message}`,
		);

	const [meeting] = await safeQuery(
		db
			.update(meetings)
			.set({
				transcriptId: payload.data.transcript.id,
				transcriptStatus: "done",
			})
			.where(
				buildWhereActive([
					{ table: meetings, filters: { botId: payload.data.bot.id } },
				]),
			)
			.returning(),
	);

	if (!meeting) throw new ApiError(404, "Meeting not found");
	return;
}

export async function handleTranscriptFailed(payload: TranscriptSchema) {
	const [meeting] = await safeQuery(
		db
			.update(meetings)
			.set({ transcriptStatus: "failed" })
			.where(
				buildWhereActive([
					{ table: meetings, filters: { botId: payload.data.bot.id } },
				]),
			)
			.returning(),
	);

	if (!meeting) throw new ApiError(404, "Meeting not found");
	return;
}
