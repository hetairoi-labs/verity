import {
	type ContentListUnion,
	createPartFromUri,
	type GenerateContentParameters,
	GoogleGenAI,
	Modality,
	type ThinkingLevel,
	type ToolListUnion,
} from "@google/genai";
import z from "zod";
import { env } from "@/lib/utils/env";
import { uploadPDFToGemini } from "../lib/utils/gemini";

export const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
export const availableModels = [
	"gemini-2.5-flash-lite",
	"gemini-2.5-flash",
	"gemini-3-flash-preview",
] as const;

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

export interface GenerateContentParams {
	contents: {
		text: string[];
		files?: {
			url: string;
			displayName: string;
		}[];
	};
	structuredOutput?: z.ZodType;
	systemInstruction?: string;
	model?: (typeof availableModels)[number];
	tools?: ToolListUnion;
	thinkingLevel?: ThinkingLevel;
	staticResponse?: boolean;
}
export async function generateContent(params: GenerateContentParams) {
	const selectedModel = params.model ?? availableModels[0];
	if (!selectedModel) throw new Error("No model selected");

	const contentInput: ContentListUnion = params.contents.text;
	if (params.contents.files && params.contents.files.length > 0) {
		for (const item of params.contents.files) {
			const file = await uploadPDFToGemini(item.url, item.displayName);
			if (file.uri && file.mimeType) {
				const fileContent = createPartFromUri(file.uri, file.mimeType);
				contentInput.push(fileContent);
			}
		}
	}

	const structuredOutputJsonSchema = params.structuredOutput
		? z.toJSONSchema(params.structuredOutput)
		: undefined;

	const generateParams: GenerateContentParameters = {
		model: selectedModel,
		contents: contentInput,
		config: {
			thinkingConfig:
				selectedModel === "gemini-3-flash-preview"
					? {
							thinkingLevel: params.thinkingLevel,
						}
					: undefined,
			systemInstruction: params.systemInstruction,
			tools: params.tools,
			responseMimeType: structuredOutputJsonSchema
				? "application/json"
				: undefined,
			responseJsonSchema: structuredOutputJsonSchema,
		},
	};

	const staticResponse = params.staticResponse
		? await ai.models.generateContent(generateParams)
		: undefined;
	const stream = params.staticResponse
		? undefined
		: await ai.models.generateContentStream(generateParams);

	return {
		staticResponse,
		stream,
	};
}
