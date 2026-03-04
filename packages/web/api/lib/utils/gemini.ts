import {
	type ContentListUnion,
	createPartFromUri,
	type GenerateContentParameters,
	GoogleGenAI,
	Modality,
	type ThinkingLevel,
	type ToolListUnion,
} from "@google/genai";
import { z } from "zod";
import { ApiError } from "@/api/lib/utils/hono/error";
import { env } from "@/lib/utils/env";

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
			expireTime,
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

export async function uploadFileToGemini(
	filePath: string,
	mimeType: string,
	displayName?: string
) {
	const url = z.url().safeParse(filePath);
	const fileBuffer = url.success
		? await fetch(url.data).then((r) => r.arrayBuffer())
		: await Bun.file(filePath).arrayBuffer();

	const fileBlob = new Blob([fileBuffer], { type: mimeType });

	const file = await ai.files.upload({
		file: fileBlob,
		config: {
			displayName,
		},
	});

	if (!file.name) {
		throw new ApiError(
			502,
			"Something went wrong while uploading the file to Gemini."
		);
	}

	let getFile = await ai.files.get({ name: file.name });
	while (getFile.state === "PROCESSING") {
		getFile = await ai.files.get({ name: file.name });
		console.log(`current file status: ${getFile.state}`);
		console.log("File is still processing, retrying in 5 seconds");

		await new Promise((resolve) => {
			setTimeout(resolve, 5000);
		});
	}
	if (file.state === "FAILED") {
		throw new ApiError(502, "File processing failed.");
	}

	return file;
}

export async function deleteFileFromGemini(name: string) {
	await ai.files.delete({ name });
	return true;
}

export interface GenerateContentParams<T extends z.ZodType = z.ZodType> {
	contents: {
		text: string[];
		files?: {
			url: string;
			mimeType: string;
			displayName?: string;
		}[];
	};
	model?: (typeof availableModels)[number];
	staticResponse?: boolean;
	structuredOutput?: T;
	systemInstruction?: string;
	thinkingLevel?: ThinkingLevel;
	tools?: ToolListUnion;
}
export async function streamTextGemini<T extends z.ZodType = z.ZodType>(
	params: GenerateContentParams<T>
) {
	const selectedModel = params.model ?? availableModels[0];
	if (!selectedModel) {
		throw new ApiError(500, "No model selected");
	}

	const contentInput: ContentListUnion = params.contents.text;
	if (params.contents.files && params.contents.files.length > 0) {
		for (const item of params.contents.files) {
			const file = await uploadFileToGemini(
				item.url,
				item.mimeType,
				item.displayName
			);
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
