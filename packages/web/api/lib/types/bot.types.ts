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

export type TranscriptArtifact = {
	id: string;
	recording: Record<string, unknown>;
	created_at: string;
	status: {
		code: "processing" | "done" | "failed" | "deleted";
		sub_code: string | null;
		updated_at: string;
	};
	metadata: Record<string, string>;
	data: {
		download_url: string | null;
		provider_data_download_url: string | null;
	};
	diarization: { use_separate_streams_when_available: boolean } | null;
	provider: Record<string, unknown>;
};

export type TranscriptWord = {
	text: string;
	start_timestamp: { absolute: string; relative: number };
	end_timestamp: { absolute: string; relative: number };
};

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
