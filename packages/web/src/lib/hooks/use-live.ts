import { GoogleGenAI, type LiveServerMessage, Modality } from "@google/genai";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	type LiveSession,
	type LogEntry,
	MODEL,
	toBase64Pcm,
} from "../utils/live";
import { useGetLiveTokenQuery } from "./api/use-ai-api";

const WS_CLOSED_PATTERN = /CLOSING|CLOSED/;

function playAudioFromBase64(
	audioData: string,
	outputCtx: AudioContext,
	activeSources: { current: Set<AudioBufferSourceNode> },
	nextStartTimeRef: { current: number },
	addLog: (msg: string) => void
) {
	try {
		const binary = atob(audioData);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i++) {
			bytes[i] = binary.charCodeAt(i);
		}
		const pcm16 = new Int16Array(bytes.buffer, 0, bytes.length / 2);
		const numSamples = pcm16.length;
		const audioBuffer = outputCtx.createBuffer(1, numSamples, 24_000);
		const channel = audioBuffer.getChannelData(0);
		for (let i = 0; i < numSamples; i++) {
			channel[i] = (pcm16[i] ?? 0) / 32_768;
		}

		const source = outputCtx.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(outputCtx.destination);

		const startTime = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
		source.start(startTime);
		nextStartTimeRef.current = startTime + audioBuffer.duration;

		activeSources.current.add(source);
		source.onended = () => {
			activeSources.current.delete(source);
		};
	} catch (decodeError) {
		addLog(`Audio decode error: ${decodeError}`);
	}
}

export function useLive() {
	const { data: token } = useGetLiveTokenQuery(true);

	const [logs, setLogs] = useState<LogEntry[]>([]);
	const [status, setStatus] = useState("idle");
	const hasInit = useRef(false);

	const inputCtxRef = useRef<AudioContext | null>(null);
	const outputCtxRef = useRef<AudioContext | null>(null);
	const sessionRef = useRef<LiveSession | null>(null);
	const nextStartTimeRef = useRef(0);
	const activeSources = useRef<Set<AudioBufferSourceNode>>(new Set());
	const isActiveRef = useRef(false);

	const addLog = useCallback((msg: string) => {
		setLogs((prev) => [
			...prev.slice(-5),
			{ message: `> ${msg}`, timestamp: new Date() },
		]);
	}, []);

	const initializeGemini = useCallback(async () => {
		if (hasInit.current) {
			return;
		}

		try {
			addLog("Initializing Gemini Live session...");
			addLog("Setting up audio contexts...");
			inputCtxRef.current = new AudioContext({ sampleRate: 16_000 });
			outputCtxRef.current = new AudioContext({ sampleRate: 24_000 });
			nextStartTimeRef.current = outputCtxRef.current.currentTime;
			inputCtxRef.current.resume().catch(() => {
				/* fire-and-forget */
			});
			outputCtxRef.current.resume().catch(() => {
				/* fire-and-forget */
			});
			addLog("Audio contexts created successfully");

			addLog("Connecting to Gemini SDK...");
			const apiKey = token;
			if (!apiKey) {
				throw new Error("Gemini token is required");
			}
			const genAI = new GoogleGenAI({
				apiKey,
				httpOptions: { apiVersion: "v1alpha" },
			});
			sessionRef.current = await genAI.live.connect({
				model: MODEL,
				config: {
					responseModalities: [Modality.AUDIO],
					systemInstruction:
						"You are a helpful voice assistant. Respond concisely when the user speaks.",
					speechConfig: {
						voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
					},
				},
				callbacks: {
					onopen: () => {
						addLog("Gemini Connection Open");
					},
					onclose: (_e) => {
						isActiveRef.current = false;
						sessionRef.current = null;
					},
					onmessage: (msg: LiveServerMessage) => {
						if ("setupComplete" in msg && msg.setupComplete !== undefined) {
							isActiveRef.current = true;
							addLog("Session ready - speak now");
							return;
						}
						if (msg.serverContent?.interrupted) {
							addLog("User interrupted AI - clearing buffer");
							for (const s of activeSources.current) {
								s.stop();
							}
							activeSources.current.clear();
							nextStartTimeRef.current = 0;
							return;
						}

						const audioData =
							msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
						if (audioData && outputCtxRef.current) {
							playAudioFromBase64(
								audioData,
								outputCtxRef.current,
								activeSources,
								nextStartTimeRef,
								addLog
							);
						}
					},
					onerror: (e) => {
						addLog(`Gemini Error: ${e.message}`);
					},
				},
			});
			addLog("Gemini connection established");

			setTimeout(() => {
				if (!isActiveRef.current && sessionRef.current) {
					isActiveRef.current = true;
					addLog("Session ready - speak now");
				}
			}, 1500);

			addLog("Requesting microphone access...");
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const sourceNode = inputCtxRef.current.createMediaStreamSource(stream);

			const processor = inputCtxRef.current.createScriptProcessor(4096, 1, 1);
			processor.onaudioprocess = (e) => {
				const float32 = e.inputBuffer.getChannelData(0);
				const base64 = toBase64Pcm(float32);

				if (sessionRef.current && isActiveRef.current) {
					try {
						sessionRef.current.sendRealtimeInput({
							audio: { data: base64, mimeType: "audio/pcm;rate=16000" },
						});
					} catch (err) {
						if (
							err instanceof Error &&
							WS_CLOSED_PATTERN.test(err.message ?? "")
						) {
							isActiveRef.current = false;
						}
					}
				}
			};

			sourceNode.connect(processor);
			processor.connect(inputCtxRef.current.destination);

			setStatus("active");
			hasInit.current = true;
			addLog("Audio pipeline ready - waiting for Gemini setup...");
		} catch (err) {
			addLog(`Init Failed: ${err}`);
			setStatus("error");
		}
	}, [addLog, token]);

	useEffect(() => {
		const timer = setTimeout(() => {
			initializeGemini();
		}, 2000);
		return () => clearTimeout(timer);
	}, [initializeGemini]);

	return { logs, status };
}
