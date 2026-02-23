import { expect, test } from "bun:test";
import { judge } from "../lib/utils/judge";
import { isIntegrationEnv } from "../lib/utils/tests";

const SAMPLE_TRANSCRIPT = `Meeting Hosts: Alice

[0s] Alice: Welcome everyone. Today we'll cover three main areas: system design, implementation patterns, and best practices. I'll start with an overview.
[45s] Alice: First, the architecture. We use a layered approach with clear separation between data, logic, and presentation. The key principle is single responsibility—each module does one thing well. We'll go into concrete examples in a moment.
[120s] Bob: Thanks. So for the data layer, what's your recommendation on handling migrations?
[150s] Alice: Good question. We version everything. Each migration is reversible, and we run them in order. I'd suggest starting with the seed data, then schema changes. Here's a diagram I prepared. [shows diagram] The flow is A to B to C, and the rollback path goes through D.
[210s] Carol: How do you handle conflict resolution when two branches touch the same table?
[240s] Alice: We use a merge strategy based on timestamps and explicit conflict markers. If two migrations overlap, the CI fails and you must resolve manually. In practice that's rare if teams own different domains. Let me show you our current migration folder structure.
[300s] Bob: That makes sense. What about the presentation layer—any specific patterns you enforce?
[320s] Alice: Yes. We use a component-driven approach. Each UI piece is isolated, testable, and composed. We also have design tokens for consistency—colors, spacing, typography. I'll share the token file after this. For state, we prefer lifting it only as high as needed; avoid global state unless it's truly global.
[380s] Carol: And error handling? Users see a lot of generic messages.
[400s] Alice: We're improving that. Each error type maps to a user-facing message and an optional recovery action. We log the technical details server-side. The rule of thumb: never expose stack traces, always suggest next steps. I have a slide on this. [shows slide]
[460s] Bob: One more thing—how do you recommend we onboard new engineers to this setup?
[480s] Alice: We have a runbook, a video walkthrough, and a sandbox environment. New folks typically pair with someone for the first week. The docs live in our wiki; I'll drop the link in chat. Any other questions before we wrap?
[520s] Carol: No, that covered it. Thanks.
[530s] Bob: Same here. Very helpful.`;

const SAMPLE_GOALS = `• Topic coverage (weight: 40): Target: 5 meetings. All planned topics discussed with examples
• Depth (weight: 35): Target: 80 percent. Concepts explained with concrete implementation details
• Clarity (weight: 25): Target: 4 score. Clear structure, examples, and next-step guidance`;

test("judge returns goalScores, aggregate, final, multiplier", async () => {
	if (!isIntegrationEnv()) return;

	const out = await judge({
		transcript: SAMPLE_TRANSCRIPT,
		goals: SAMPLE_GOALS,
	});

	console.log(out);

	expect(Array.isArray(out.raw)).toBe(true);
	expect(out.raw.length).toBeGreaterThan(0);
	expect(
		out.raw.every((r) => r.goal && typeof r.score === "number" && r.reasoning),
	).toBe(true);

	expect(typeof out.aggregate).toBe("number");
	expect(out.aggregate).toBeGreaterThanOrEqual(0);
	expect(out.aggregate).toBeLessThanOrEqual(5);

	expect(typeof out.final).toBe("number");
	expect(typeof out.multiplier).toBe("number");
	expect(out.multiplier).toBeGreaterThanOrEqual(0.4);
	expect(out.multiplier).toBeLessThanOrEqual(1);
}, 30_000);
