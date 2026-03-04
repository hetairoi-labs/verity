export interface Recording {
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
}

export interface Bot {
	id: string;
	recordings: Recording[];
}

export interface TranscriptArtifact {
	created_at: string;
	data: {
		download_url: string | null;
		provider_data_download_url: string | null;
	};
	diarization: { use_separate_streams_when_available: boolean } | null;
	id: string;
	metadata: Record<string, string>;
	provider: Record<string, unknown>;
	recording: Record<string, unknown>;
	status: {
		code: "processing" | "done" | "failed" | "deleted";
		sub_code: string | null;
		updated_at: string;
	};
}

export interface TranscriptWord {
	end_timestamp: { absolute: string; relative: number };
	start_timestamp: { absolute: string; relative: number };
	text: string;
}

export type Transcript = {
	participant: {
		id: string | number;
		name: string | null;
		is_host: boolean | null;
		platform: string | null;
		extra_data: Record<string, unknown> | null;
		email?: string | null;
	};
	words: TranscriptWord[];
}[];
