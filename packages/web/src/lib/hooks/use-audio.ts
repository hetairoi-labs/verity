import { GoogleGenAI, type LiveServerMessage, Modality } from "@google/genai";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApi } from "./api/use-api";

const MODEL = "gemini-2.5-flash-native-audio-preview-12-2025";

interface LogEntry {
	message: string;
	timestamp: Date;
}

interface LiveSession {
	sendRealtimeInput(input: { audio: { data: string; mimeType: string } }): void;
}

export function useAudio() {
	const getToken = useApi().getToken;
	const token = getToken.data;

	const [logs, setLogs] = useState<LogEntry[]>([]);
	const [status, setStatus] = useState("idle");
	const hasInit = useRef(false);

	// Audio Contexts & Refs
	const inputCtxRef = useRef<AudioContext | null>(null);
	const outputCtxRef = useRef<AudioContext | null>(null);
	const sessionRef = useRef<LiveSession | null>(null);
	const nextStartTimeRef = useRef(0);
	const activeSources = useRef<Set<AudioBufferSourceNode>>(new Set());
	const isActiveRef = useRef(false); // Use ref to avoid stale closure in onaudioprocess

	const addLog = useCallback((msg: string) => {
		setLogs((prev) => [
			...prev.slice(-5),
			{ message: `> ${msg}`, timestamp: new Date() },
		]);
	}, []);

	const initializeGemini = useCallback(async () => {
		// Helper: Convert Browser Float32 to Gemini's 16-bit PCM Base64
		const toBase64Pcm = (float32: Float32Array) => {
			const pcm16 = new Int16Array(float32.length);
			for (let i = 0; i < float32.length; i++) {
				const sample = float32[i] ?? 0;
				const s = Math.max(-1, Math.min(1, sample));
				pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
			}
			return btoa(
				String.fromCharCode(...Array.from(new Uint8Array(pcm16.buffer))),
			);
		};
		if (hasInit.current) return;

		try {
			addLog("Initializing Gemini Live session...");
			console.log("[DEBUG] Starting Gemini initialization");

			// 1. Setup Audio Contexts (Dual Sample Rates)
			addLog("Setting up audio contexts...");
			console.log("[DEBUG] Creating input audio context (16kHz)");
			inputCtxRef.current = new AudioContext({ sampleRate: 16000 });
			console.log("[DEBUG] Creating output audio context (24kHz)");
			outputCtxRef.current = new AudioContext({ sampleRate: 24000 });
			nextStartTimeRef.current = outputCtxRef.current.currentTime;
			// Resume contexts - don't await; it can hang until user gesture (e.g. mic permission)
			void inputCtxRef.current.resume();
			void outputCtxRef.current.resume();
			addLog("Audio contexts created successfully");

			// 2. Connect to Gemini SDK
			addLog("Connecting to Gemini SDK...");
			console.log("[DEBUG] Checking API key");
			const apiKey = token;
			if (!apiKey) {
				throw new Error("Gemini token is required");
			}
			console.log("[DEBUG] Creating GoogleGenAI instance");
			const genAI = new GoogleGenAI({
				apiKey,
				httpOptions: { apiVersion: "v1alpha" },
			});
			console.log("[DEBUG] Calling genAI.live.connect()");
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
						console.log(
							"[DEBUG] Gemini WebSocket connection opened successfully",
						);
					},
					onclose: (e) => {
						console.log("[DEBUG] Gemini WebSocket closed:", e?.code, e?.reason);
						isActiveRef.current = false;
						sessionRef.current = null;
					},
					onmessage: async (msg: LiveServerMessage) => {
						console.log("[DEBUG] Received Gemini message:", msg);
						// Wait for setupComplete before sending - API requires this (do not send realtime input before)
						if ("setupComplete" in msg && msg.setupComplete !== undefined) {
							console.log("[DEBUG] Setup complete - session ready for input");
							isActiveRef.current = true;
							addLog("Session ready - speak now");
							return;
						}
						// Handle Barge-in (Interruption)
						if (msg.serverContent?.interrupted) {
							console.log(
								"[DEBUG] Handling interruption - clearing audio buffer",
							);
							addLog("User interrupted AI - clearing buffer");
							activeSources.current.forEach((s) => {
								s.stop();
							});
							activeSources.current.clear();
							nextStartTimeRef.current = 0;
							return;
						}

						// Handle Audio Response (24kHz)
						const audioData =
							msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
						if (audioData && outputCtxRef.current) {
							try {
								// Gemini returns raw 16-bit PCM at 24kHz - decodeAudioData can't handle raw PCM
								const binary = atob(audioData);
								const bytes = new Uint8Array(binary.length);
								for (let i = 0; i < binary.length; i++)
									bytes[i] = binary.charCodeAt(i);
								const pcm16 = new Int16Array(bytes.buffer, 0, bytes.length / 2);
								const numSamples = pcm16.length;
								const audioBuffer = outputCtxRef.current.createBuffer(
									1,
									numSamples,
									24000,
								);
								const channel = audioBuffer.getChannelData(0);
								for (let i = 0; i < numSamples; i++) {
									channel[i] = (pcm16[i] ?? 0) / 32768;
								}

								const source = outputCtxRef.current.createBufferSource();
								source.buffer = audioBuffer;
								source.connect(outputCtxRef.current.destination);

								const startTime = Math.max(
									nextStartTimeRef.current,
									outputCtxRef.current.currentTime,
								);
								console.log(
									`[DEBUG] Scheduling audio playback at ${startTime}s`,
								);
								source.start(startTime);
								nextStartTimeRef.current = startTime + audioBuffer.duration;

								activeSources.current.add(source);
								source.onended = () => {
									console.log("[DEBUG] Audio playback completed");
									activeSources.current.delete(source);
								};
							} catch (decodeError) {
								console.error("[DEBUG] Audio decoding failed:", decodeError);
								addLog(`Audio decode error: ${decodeError}`);
							}
						} else {
							console.log(
								`[DEBUG] No audio data in message or no output context. Audio data: ${!!audioData}, output context: ${!!outputCtxRef.current}`,
							);
						}
					},
					onerror: (e) => {
						console.error("[DEBUG] Gemini connection error:", e);
						addLog(`Gemini Error: ${e.message}`);
					},
				},
			});
			addLog("Gemini connection established");

			// Fallback: if SDK doesn't forward setupComplete, enable after brief delay
			setTimeout(() => {
				if (!isActiveRef.current && sessionRef.current) {
					console.log("[DEBUG] Setup complete fallback - enabling after delay");
					isActiveRef.current = true;
					addLog("Session ready - speak now");
				}
			}, 1500);

			// 3. Start Microphone Capture (16kHz)
			addLog("Requesting microphone access...");
			console.log("[DEBUG] Calling getUserMedia for microphone access");
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			console.log("[DEBUG] Microphone access granted, creating source node");
			const sourceNode = inputCtxRef.current.createMediaStreamSource(stream);

			console.log("[DEBUG] Creating script processor for audio processing");
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
							/CLOSING|CLOSED/.test(err.message ?? "")
						) {
							isActiveRef.current = false;
						}
					}
				}
			};

			console.log("[DEBUG] Connecting audio nodes");
			sourceNode.connect(processor);
			processor.connect(inputCtxRef.current.destination);

			setStatus("active");
			hasInit.current = true;
			addLog("Audio pipeline ready - waiting for Gemini setup...");
		} catch (err) {
			console.error("[DEBUG] Initialization failed:", err);
			addLog(`Init Failed: ${err}`);
			setStatus("error");
		}
	}, [addLog, token]);

	useEffect(() => {
		console.log("[DEBUG] Scheduling Gemini initialization in 2 seconds");
		const timer = setTimeout(() => {
			console.log("[DEBUG] Timer expired, calling initializeGemini");
			initializeGemini();
		}, 2000);
		return () => clearTimeout(timer);
	}, [initializeGemini]);

	return { logs, status };
}
