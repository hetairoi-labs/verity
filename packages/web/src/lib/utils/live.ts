export const MODEL = "gemini-2.5-flash-native-audio-preview-12-2025";

export interface LogEntry {
	message: string;
	timestamp: Date;
}

export interface LiveSession {
	sendRealtimeInput(input: { audio: { data: string; mimeType: string } }): void;
}

export const toBase64Pcm = (float32: Float32Array) => {
	const pcm16 = new Int16Array(float32.length);
	for (let i = 0; i < float32.length; i++) {
		const sample = float32[i] ?? 0;
		const s = Math.max(-1, Math.min(1, sample));
		pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
	}
	return btoa(String.fromCharCode(...Array.from(new Uint8Array(pcm16.buffer))));
};
