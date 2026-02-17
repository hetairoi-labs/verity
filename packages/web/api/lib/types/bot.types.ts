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
