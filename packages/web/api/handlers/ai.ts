import z from "zod";
import { streamChatCerebras, streamTextCerebras } from "../lib/utils/cerebras";

export const fastTextInputSchema = z.object({
	prompt: z.string().min(1, "Prompt is required"),
});
export type fastTextInput = z.infer<typeof fastTextInputSchema>;
export async function fastText(params: fastTextInput) {
	return streamTextCerebras(params.prompt);
}

export const fastChatParamsSchema = z.object({
	message: z.string().min(1, "Message is required"),
	conversationHistory: z.array(
		z.object({
			role: z.enum(["user", "assistant"]),
			content: z.string().min(1, "Content is required"),
		}),
	),
});
export type fastChatParams = z.infer<typeof fastChatParamsSchema>;
export async function fastChat(params: fastChatParams) {
	return streamChatCerebras(params.message, params.conversationHistory);
}
