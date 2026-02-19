import { z } from "zod";

const botBase = z.object({
	id: z.uuid(),
	metadata: z.record(z.string(), z.string()),
});

const botStatusSchema = z.object({
	event: z.enum([
		"bot.joining_call",
		"bot.in_waiting_room",
		"bot.in_call_recording",
		"bot.in_not_call_recording",
		"bot.call_ended",
	]),
	data: z.object({
		bot: botBase,
		data: z.object({
			code: z.enum([
				"joining_call",
				"in_waiting_room",
				"in_call_recording",
				"in_not_call_recording",
				"call_ended",
			]),
			sub_code: z.string().nullable(),
			updated_at: z.iso.datetime({ offset: true }),
		}),
	}),
});

const transcriptSchema = z.object({
	event: z.enum(["transcript.done", "transcript.failed"]),
	data: z.object({
		bot: botBase,
		data: z.object({
			code: z.enum(["done", "failed"]),
			sub_code: z.string().nullable(),
			updated_at: z.iso.datetime({ offset: true }),
		}),
		recording: z.object({
			id: z.uuid(),
			metadata: z.record(z.string(), z.string()),
		}),
		transcript: z.object({
			id: z.uuid(),
			metadata: z.record(z.string(), z.string()),
		}),
	}),
});

export const recallWebhookSchema = z.discriminatedUnion("event", [
	botStatusSchema,
	transcriptSchema,
]);

export type RecallWebhookSchema = z.infer<typeof recallWebhookSchema>;
