declare module "*.svg" {
	const src: string;
	export default src;
}
declare module "*.png" {
	const src: string;
	export default src;
}
declare module "*.jpg" {
	const src: string;
	export default src;
}
declare module "*.jpeg" {
	const src: string;
	export default src;
}
declare module "*.gif" {
	const src: string;
	export default src;
}
declare module "*.avif" {
	const src: string;
	export default src;
}
declare module "*.mp4" {
	const src: string;
	export default src;
}
declare module "*.webp" {
	const src: string;
	export default src;
}
declare module "*.webm" {
	const src: string;
	export default src;
}

// Global type declarations
interface Window {
	gtag?: (...args: unknown[]) => void;
}

const _window: Window = window;

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
