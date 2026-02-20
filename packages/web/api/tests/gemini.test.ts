import { afterAll, describe, expect, test } from "bun:test";
import path from "node:path";
import { FileState } from "@google/genai";
import { z } from "zod";
import { safe } from "@/lib/utils/safe";
import {
	deleteFileFromGemini,
	getGeminiEphemeralToken,
	streamTextGemini,
	uploadFileToGemini,
} from "../lib/utils/gemini";
import { isIntegrationEnv } from "../lib/utils/tests";

describe("getGeminiEphemeralToken", () => {
	test("should generate a token", async () => {
		if (!isIntegrationEnv()) return;

		const token = await getGeminiEphemeralToken();
		expect(token.name).toBeDefined();
		expect(typeof token.name).toBe("string");
		expect(token.name?.length).toBeGreaterThan(0);
	});
});

describe("uploadPDFToGemini", () => {
	let hostedFileName: string | undefined;

	afterAll(async () => {
		if (!hostedFileName) return;
		await deleteFileFromGemini(hostedFileName);
	});

	test("should fail for non-existent file", async () => {
		const fileName = "non-existent.pdf";
		const filePath = path.join(process.cwd(), "/api/temp", fileName);
		expect(
			uploadFileToGemini(filePath, "application/pdf", fileName),
		).rejects.toThrow();
	});
	test("should upload a local PDF file to Gemini", async () => {
		if (!isIntegrationEnv()) return;
		const fileName = "test.pdf";
		const filePath = path.join(process.cwd(), "/api/temp", fileName);
		const uploadedFile = await uploadFileToGemini(
			filePath,
			"application/pdf",
			fileName,
		);

		hostedFileName = uploadedFile.name;
		expect(hostedFileName).toBeDefined();
		expect(uploadedFile.mimeType).toBe("application/pdf");
		expect(uploadedFile.displayName).toBe(fileName);
		expect(uploadedFile.state).toBe(FileState.ACTIVE);
	});
	test("should accept hosted pdfs", async () => {
		if (!isIntegrationEnv()) return;
		const url = "https://pdfobject.com/pdf/sample.pdf"; // 18KB
		const uploadedFile = await uploadFileToGemini(url, "application/pdf");

		console.log({ uploadedFile });

		hostedFileName = uploadedFile.name;
		expect(hostedFileName).toBeDefined();
		expect(uploadedFile.mimeType).toBe("application/pdf");
		expect(uploadedFile.displayName).toBeUndefined();
		expect(uploadedFile.state).toBe(FileState.ACTIVE);
	});
});

describe("streamTextGemini", () => {
	test("test structured content streaming with enabled tools", async () => {
		// if (!isIntegrationEnv()) return;
		const structuredOutputSchema = z.object({
			greeting: z.string(),
			weather: z.string(),
			docSummary: z.string(),
			pdfSummary: z.string(),
		});
		const text = [
			"1. What is the current weather in Jaunpur, UP? (Search Web)",
			"2. What is this doc about: https://ai.google.dev/gemini-api/docs/code-execution",
			"3. Summarize the attached document",
		];
		const files = [
			{
				url: "https://pdfobject.com/pdf/sample.pdf",
				mimeType: "application/pdf",
				displayName: "sample.pdf",
			},
		];
		const systemInstruction = "Greetings should contain 'Hail Kartik!'";

		const { stream } = await streamTextGemini<typeof structuredOutputSchema>({
			contents: { text, files },
			structuredOutput: structuredOutputSchema,
			systemInstruction,
		});
		const chunks: { text: string | undefined; timestamp: number }[] = [];
		const startTime = Date.now();

		if (!stream) throw new Error("Response type should be stream by default");

		for await (const chunk of stream) {
			chunks.push({
				text: chunk.candidates?.[0]?.content?.parts?.[0]?.text,
				timestamp: Date.now() - startTime,
			});
		}

		expect(chunks.length).toBeGreaterThan(0);
		const fullContent = chunks.map((c) => c.text).join("");
		expect(fullContent.length).toBeGreaterThan(10);
		expect(fullContent).toContain("Hail Kartik!");

		const [result, error] = safe(() =>
			structuredOutputSchema.parse(JSON.parse(fullContent)),
		);
		console.log(result);
		expect(error).toBeNull();
		expect(result).toBeDefined();
	}, 60_000);
});
