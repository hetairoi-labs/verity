import { GoogleGenAI, Modality, ThinkingLevel } from "@google/genai";
import { env } from "@/lib/utils/env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export async function getGeminiEphemeralToken() {
	const expireTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
	const model = "gemini-live-2.5-flash-native-audio";

	const token = await ai.authTokens.create({
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

	return token;
}

export async function generateContent(
	prompt: string,
	systemInstruction: string,
) {
	const models = [
		"gemini-3-flash-preview",
		"gemini-2.5-flash",
		"gemini-2.5-flash-lite",
	] as const;
	const pdfResp = await fetch(
		"https://discovery.ucl.ac.uk/id/eprint/10089234/1/343019_3_art_0_py4t4l_convrt.pdf",
	).then((response) => response.arrayBuffer());

	const contents = [
		{
			text: prompt,
		},
		{
			inlineData: {
				mimeType: "application/pdf",
				data: Buffer.from(pdfResp).toString("base64"),
			},
		},
	].filter(Boolean);

	const config = {
		thinkingConfig: {
			thinkingLevel: ThinkingLevel.LOW,
		},
		systemInstruction: systemInstruction,
	};

	return await ai.models.generateContent({
		model: models[0],
		contents,
		config,
	});
}
