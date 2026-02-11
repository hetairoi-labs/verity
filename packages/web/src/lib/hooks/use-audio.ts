import { useCallback, useEffect, useRef, useState } from "react";

type AudioLog = {
	message: string;
	timestamp: Date;
};

export function useAudio() {
	const [logs, setLogs] = useState<AudioLog[]>([]);
	const hasInit = useRef(false);
	const audioContextRef = useRef<AudioContext | null>(null);
	const streamRef = useRef<MediaStream | null>(null);

	const addLog = useCallback((message: string) => {
		setLogs((prev) => [
			...prev.slice(-5),
			{ message: `> ${message}`, timestamp: new Date() },
		]);
	}, []);

	const cleanup = useCallback(() => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => {
				track.stop();
			});
			streamRef.current = null;
		}
		if (audioContextRef.current) {
			audioContextRef.current.close();
			audioContextRef.current = null;
		}
		hasInit.current = false;
	}, []);

	const initializeAudio = useCallback(async () => {
		if (hasInit.current) return;

		try {
			addLog("Requesting microphone access...");
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;
			addLog("Microphone captured successfully!");

			const AudioContextClass =
				window.AudioContext ||
				(window as typeof window & { webkitAudioContext?: typeof AudioContext })
					.webkitAudioContext;
			const ctx = new AudioContextClass();
			audioContextRef.current = ctx;

			if (ctx.state === "suspended") await ctx.resume();
			addLog(`Audio context initialized: ${ctx.state}`);

			const source = ctx.createMediaStreamSource(stream);
			source.connect(ctx.destination);
			addLog("Audio loopback active - microphone connected to speakers");

			hasInit.current = true;
		} catch (err) {
			addLog(
				`Audio initialization failed: ${err instanceof Error ? err.message : String(err)}`,
			);
			console.error("Audio initialization error:", err);
		}
	}, [addLog]);

	useEffect(() => {
		const timer = setTimeout(initializeAudio, 2000);
		return () => {
			clearTimeout(timer);
			cleanup();
		};
	}, [initializeAudio, cleanup]);

	return { logs, isInitialized: hasInit.current, initializeAudio, cleanup };
}
