import z from "zod";
import { safe } from "@/lib/utils/safe";
import { streamTextGemini } from "./gemini";
import { ApiError } from "./hono/error";

const systemPrompt = `You are a neutral judge evaluating knowledge exchange quality.
Compare the transcript against the given goals. For each goal, score 0-5 and provide brief reasoning.

Criteria: topic coverage, depth, relevance, clarity, completeness, accuracy.
For the "goal" field, return only the short key (e.g. "Topic coverage", "Depth"), not the full line. Be fair; give full score if only minimal improvements needed.`;

const structuredOutputSchema = z.array(
	z.object({
		goal: z.string().describe("The goal key from the list (exact match)"),
		score: z
			.number()
			.min(0)
			.max(5)
			.describe(
				"Score 0-5: topic coverage, depth, relevance, clarity, completeness, accuracy",
			),
		reasoning: z
			.string()
			.describe("Brief bullet points: what was good, what could improve"),
		improvements: z.string().describe("Scope for improvements if any"),
	}),
);

export type JudgeInput = {
	transcript: string;
	goals: string;
	userRatings?: number[];
};

export async function judge(params: JudgeInput) {
	// hyperparameters
	const alpha = 0.8;
	const tau = 0.3;

	// generate ai scores
	const { transcript, goals, userRatings = [] } = params;
	if (!transcript.trim() || !goals.trim()) {
		throw new ApiError(400, "Transcript & goals are required");
	}
	const inputPrompt = `## Goals to evaluate\n\n${goals}\n\n## Transcript\n\n${transcript}`;
	const { staticResponse } = await streamTextGemini({
		contents: { text: [inputPrompt] },
		structuredOutput: structuredOutputSchema,
		systemInstruction: systemPrompt,
		staticResponse: true,
	});
	const text = staticResponse?.text;
	if (!text) {
		throw new ApiError(502, "No content from judge model");
	}
	const [raw, error] = safe(() =>
		structuredOutputSchema.parse(JSON.parse(text)),
	);
	if (error) {
		throw new ApiError(
			502,
			`Model produced malformed structure: ${error.message}`,
		);
	}

	// weighted average score for goals (key = part before " (weight: N):")
	const weightByKey = new Map<string, number>();
	for (const m of goals.matchAll(/• (.+?) \(weight: (\d+)\):/g)) {
		if (m[1] != null && m[2] != null)
			weightByKey.set(m[1].trim(), Number(m[2]));
	}
	const toKey = (goal: string) =>
		goal.includes(" (weight: ")
			? goal.split(" (weight: ")[0]?.trim() ?? goal
			: goal.trim();
	const { sumWS, sumW } = raw.reduce(
		(acc, { goal, score }) => {
			const w = weightByKey.get(toKey(goal)) ?? 0;
			return { sumWS: acc.sumWS + w * score, sumW: acc.sumW + w };
		},
		{ sumWS: 0, sumW: 0 },
	);
	const aggregate = sumW ? sumWS / sumW : 0;

	// blend with user ratings based on alpha
	const final =
		userRatings.length && alpha < 1
			? alpha * aggregate +
				(1 - alpha) *
					(userRatings.reduce((a, b) => a + b, 0) / userRatings.length)
			: aggregate;

	// calculate payout multiplier (0.4–1.0)
	const multiplier = 0.4 + 0.6 / (1 + Math.exp(-(final - 2.5) / tau));

	return {
		raw, // per-goal: { goal, score, reasoning, improvements }
		aggregate, // weighted avg 0–5
		final,
		multiplier, // 0.4–1.0 for refund calc
	};
}
