import { z } from "zod";
import { ai } from "@/api/handlers/gemini";

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
