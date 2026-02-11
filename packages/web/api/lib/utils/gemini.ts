import { GoogleGenAI, Modality } from "@google/genai";
import { env } from "@/utils/env";

export async function getGeminiEphemeralToken() {
	const client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
	const expireTime = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
	const model = "gemini-2.5-flash-native-audio-preview-12-2025"; // Native audio model

	const token = await client.authTokens.create({
		config: {
			uses: 1,
			expireTime: expireTime,
			liveConnectConstraints: {
				model,
				config: {
					sessionResumption: {},
					temperature: 0.7,
					responseModalities: [Modality.AUDIO],
				},
			},
			httpOptions: {
				apiVersion: "v1alpha",
			},
		},
	});

	return token.name;
}
