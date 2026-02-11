declare class MediaStreamTrackProcessor {
	constructor(options: { track: MediaStreamTrack });
	readable: ReadableStream<AudioData>;
}

declare class MediaStreamTrackGenerator {
	constructor(init: { kind: "audio" | "video" });
	writable: WritableStream<AudioData>;
	track: MediaStreamTrack;
}

declare class AudioData {
	format: string;
	sampleRate: number;
	numberOfFrames: number;
	numberOfChannels: number;
	timestamp: number;
	duration: number;
	allocationSize(options: { planeIndex: number }): number;
	copyTo(destination: BufferSource, options: { planeIndex: number }): void;
	close(): void;
}
