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
	ratings?: {
		average: number;
		count: number;
	};
	reputation?: {
		avgScore: number;
		sessionCount: number;
	};
};

export async function judge(params: JudgeInput) {
	const tau = 0.3;
	const { transcript, goals, ratings, reputation } = params;

	// compute alpha based on user ratings and historical reputation
	const alpha = computeAlpha({
		ratings,
		reputation,
	});

	// generate ai scores
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

	// compute weighted average score for goals
	const weightByKey = new Map<string, number>();
	for (const m of goals.matchAll(/• (.+?) \(weight: (\d+)\):/g)) {
		if (m[1] != null && m[2] != null)
			weightByKey.set(m[1].trim(), Number(m[2]));
	}
	const toKey = (goal: string) =>
		goal.includes(" (weight: ")
			? (goal.split(" (weight: ")[0]?.trim() ?? goal)
			: goal.trim();
	const { sumWS, sumW } = raw.reduce(
		(acc, { goal, score }) => {
			const w = weightByKey.get(toKey(goal)) ?? 0;
			return { sumWS: acc.sumWS + w * score, sumW: acc.sumW + w };
		},
		{ sumWS: 0, sumW: 0 },
	);
	const aggregate = sumW ? sumWS / sumW : 0;

	// blend with participant ratings when available
	const final =
		ratings?.count &&
		ratings?.count > 0 &&
		ratings?.average != null &&
		ratings?.average >= 0 &&
		alpha < 1
			? alpha * aggregate + (1 - alpha) * ratings?.average
			: aggregate;

	const multiplier = 0.25 + 0.75 / (1 + Math.exp(-(final - 2.5) / tau));

	return {
		raw,
		aggregate,
		final,
		multiplier,
	};
}

function computeAlpha(p: {
	ratings?: {
		average: number;
		count: number;
	};
	reputation?: {
		avgScore: number;
		sessionCount: number;
	};
}): number {
	if (p.ratings?.count === 0) return 1;

	let alpha = 0.95;
	alpha -= 0.35 * Math.min(1, (p.ratings?.count ?? 0) / 8);
	alpha -= 0.05 * Math.min(1, (p.reputation?.sessionCount ?? 0) / 20);
	if (
		(p.reputation?.sessionCount ?? 0) >= 1 &&
		p.reputation?.avgScore != null
	) {
		alpha += p.reputation?.avgScore < 2 ? 0.05 : 0;
		alpha -= p.reputation?.avgScore >= 3.5 ? 0.05 : 0;
	}
	return Math.max(0.5, Math.min(1, alpha));
}
