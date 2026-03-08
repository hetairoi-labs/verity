import { getAddress, type Hex, isAddress, isHex } from "viem";
import { z } from "zod";

export const zEvmAddress = () =>
	z
		.string()
		.refine((value) => isAddress(value), "Invalid Ethereum address")
		.transform((value) => getAddress(value));

export const zHex = () =>
	z
		.string()
		.refine((value) => isHex(value), "Invalid Ethereum address")
		.transform((value) => value as Hex);

const zEvmConfig = () =>
	z.object({
		chainSelectorName: z.string().min(1),
		sessionRegistryAddress: z
			.string()
			.regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
		managerAddress: z
			.string()
			.regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
		gasLimit: z
			.string()
			.regex(/^\d+$/, "gasLimit must be a numeric string")
			.refine((val) => Number(val) > 0, {
				message: "gasLimit must be greater than 0",
			}),
	});

export const zConfig = () =>
	z.object({
		model: z.string(),
		evms: z.array(zEvmConfig()).min(1, "At least one EVM config is required"),
	});

export const zAiEvaluationResponse = () =>
	z.object({
		result: z.array(
			z.object({
				goal: z.string().describe("The goal key from the list (exact match)"),
				score: z
					.number()
					.min(0)
					.max(10000)
					.describe(
						"Score 0-10000 basepoints: topic coverage, depth, relevance, clarity, completeness, accuracy",
					),
				reasoning: z
					.string()
					.describe("Brief bullet points: what was good, what could improve"),
				improvements: z
					.string()
					.array()
					.describe("Scopes for improvements if any"),
			}),
		),
		confidence: z
			.number()
			.min(0)
			.max(10000)
			.describe("Confidence score in basepoints"),
	});

export const zSessionDetails = () =>
	z.object({
		// sessionId: z.number(),
		topic: z.string(),
		price: z.number(),
		goals: z.array(z.object({ name: z.string(), weight: z.number() })),
		metadata: z.string(),
		transcriptId: z.string(),
	});

export const zWriteToStoreResponse = () =>
	z.object({
		data: z.object({
			cid: z.string(),
		}),
	});

export const zListingData = () =>
	zSessionDetails().omit({
		transcriptId: true,
		// sessionId: true
	});

export const zStoreKeySchemas = () => ({
	evaluationReport: z.object({
		score: z.number(),
		reasoning: z.string(),
		improvements: z.string().array(),
	}),
	sessionData: zSessionDetails(),
	unpublishedSessionData: zListingData(),
});

export const zRecallTranscriptArtifactResponse = () =>
	z.object({
		id: z.string(),
		created_at: z.string(),
		data: z.object({
			download_url: z.string().nullable(),
			provider_data_download_url: z.string().nullable(),
		}),
	});

export const zRecallTranscriptResponse = () =>
	z
		.object({
			participant: z.object({
				id: z.union([z.string(), z.number()]),
				name: z.string().nullable(),
				is_host: z.boolean().nullable(),
				platform: z.string().nullable(),
				extra_data: z.any().nullable(),
				email: z.string().nullable().optional(),
			}),
			words: z.array(
				z.object({
					text: z.string(),
					start_timestamp: z.object({
						absolute: z.string(),
						relative: z.number(),
					}),
					end_timestamp: z.object({
						absolute: z.string(),
						relative: z.number(),
					}),
				}),
			),
		})
		.array();

export const zRecallBotCreationResponse = () =>
	z.object({
		id: z.string(),
		recordings: z.array(
			z.object({
				id: z.string(),
				media_shortcuts: z.object({
					transcript: z.object({
						id: z.string(),
					}),
				}),
			}),
		),
	});
