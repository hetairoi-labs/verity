import Cerebras from "@cerebras/cerebras_cloud_sdk";
import { z } from "zod";
import { ApiError } from "@/api/lib/utils/hono/error";
import { env } from "@/lib/utils/env";

const client = new Cerebras({
	apiKey: env.CEREBRAS_API_KEY,
});
const MODEL = "gpt-oss-120b";

export interface CerebrasMessagesInputType {
	content: string;
	role: "user" | "assistant" | "system";
}

interface CompletionChunk {
	choices: Array<{
		text?: string;
	}>;
}

export async function* streamTextCerebras(prompt: string) {
	const stream = await client.completions.create({
		prompt,
		model: MODEL,
		stream: true,
	});
	for await (const chunk of stream as AsyncIterable<CompletionChunk>) {
		const text = (chunk as CompletionChunk).choices[0]?.text || "";
		if (text) {
			yield text;
		}
	}
}

interface StreamChunk {
	choices: Array<{
		delta?: {
			content?: string;
		};
		message?: {
			content?: string;
		};
	}>;
}

export async function* streamChatCerebras(
	message: string,
	conversationHistory: CerebrasMessagesInputType[]
) {
	const messages = [
		...conversationHistory,
		{ role: "user" as const, content: message },
	];

	const stream = await client.chat.completions.create({
		messages: messages as never,
		model: MODEL,
		stream: true,
	});
	for await (const chunk of stream as AsyncIterable<StreamChunk>) {
		const content = (chunk as StreamChunk).choices[0]?.delta?.content || "";
		if (content) {
			yield content;
		}
	}
}

export async function structuredCerebras<T extends z.ZodType>(
	prompt: string,
	schema: T
) {
	const jsonSchema = z.toJSONSchema(schema);

	const completion = await client.chat.completions.create({
		model: MODEL,
		messages: [{ role: "user", content: prompt }],
		response_format: {
			type: "json_schema",
			json_schema: {
				name: "structured_output",
				strict: true,
				schema: jsonSchema,
			},
		},
	});

	const content = (completion as StreamChunk).choices[0]?.message?.content;
	if (!content) {
		throw new ApiError(502, "No content received from Cerebras API");
	}

	return schema.parse(JSON.parse(content));
}
