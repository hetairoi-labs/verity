import type { Transcript } from "../../types/bot.types";

export function compressTranscript(transcript: Transcript): string {
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

export function saveTranscript(id: string, transcript: string) {
	Bun.write(`${process.cwd()}/transcripts/${id}.txt`, transcript);
}
