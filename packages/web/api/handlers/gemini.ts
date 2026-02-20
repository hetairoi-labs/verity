import {
	type ContentListUnion,
	createPartFromUri,
	GoogleGenAI,
	Modality,
	type ThinkingLevel,
	type ToolListUnion,
} from "@google/genai";
import z from "zod";
import { env } from "@/lib/utils/env";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
const availableModels = [
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

export async function uploadPDFToGemini(
	filePath: string,
	displayName?: string,
) {
	const url = z.url().safeParse(filePath);
	const pdfBuffer = url.success
		? await fetch(url.data).then((r) => r.arrayBuffer())
		: await Bun.file(filePath).arrayBuffer();

	const fileBlob = new Blob([pdfBuffer], { type: "application/pdf" });

	const file = await ai.files.upload({
		file: fileBlob,
		config: {
			displayName,
		},
	});

	if (!file.name) {
		throw new Error("Something went wrong while uploading the file to Gemini.");
	}

	// Wait for the file to be processed.
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
		throw new Error("File processing failed.");
	}

	return file;
}

export async function deleteFileFromGemini(name: string) {
	await ai.files.delete({ name });
	console.log("deleted file from gemini", name);
}

export async function generateContentStream(
	contents: {
		text: string[];
		files?: {
			url: string;
			displayName: string;
		}[];
		structuredOutput?: z.ZodType;
	},
	systemInstruction?: string,
	model?: (typeof availableModels)[number],
	tools?: ToolListUnion,
	thinkingLevel?: ThinkingLevel,
) {
	const selectedModel = model ?? availableModels[0];
	if (!selectedModel) throw new Error("No model selected");

	const contentInput: ContentListUnion = contents.text;
	if (contents.files && contents.files.length > 0) {
		for (const item of contents.files) {
			const file = await uploadPDFToGemini(item.url, item.displayName);
			if (file.uri && file.mimeType) {
				const fileContent = createPartFromUri(file.uri, file.mimeType);
				contentInput.push(fileContent);
			}
		}
	}

	return await ai.models.generateContentStream({
		model: selectedModel,
		contents: contentInput,
		config: {
			thinkingConfig:
				selectedModel === "gemini-3-flash-preview"
					? {
							thinkingLevel,
						}
					: undefined,
			systemInstruction,
			tools,
		},
	});
}
