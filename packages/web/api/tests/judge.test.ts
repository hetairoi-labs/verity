import { test } from "bun:test";
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

const BAD_HOST_TRANSCRIPT = `Meeting Hosts: Dave

[0s] Dave: Hey folks. So before we get into things, you won't believe what happened to me last weekend. I was at the airport and my flight got cancelled, and then the hotel overbooked, so I had to sleep in the lobby. Crazy right?
[60s] Bob: Um, could we maybe cover the technical stuff?
[65s] Dave: Oh right, sure. So anyway that reminds me of this one time at my old company we had a similar situation with our deployment. The servers went down and we were all panicking. Good times. Well not good times but you know.
[120s] Carol: What about the architecture overview you mentioned in the agenda?
[125s] Dave: Yeah the architecture. It's like, we have layers. You know, the usual stuff. Data goes in, comes out. We try to keep things organized. I'm sure you've seen it before.
[180s] Bob: Do you have any concrete examples or documentation we could follow?
[185s] Dave: Documentation. Yeah we should probably update that at some point. The last person who maintained it left and it's a bit outdated. But the code is self-explanatory if you dig in. Or you can just ask around. Someone will know.
[240s] Carol: What about migrations and conflict resolution?
[245s] Dave: Migrations, yeah. We run them. There's a script. Sometimes things break but we fix it. It's been a while since I touched that part honestly. Oh and another story—we had this one migration that took like 12 hours. We ordered pizza. Fun night.
[300s] Bob: Can you go through the presentation layer patterns?
[305s] Dave: UI stuff. We use components. Or maybe it's modules. One of those. The design team has tokens somewhere. I'd have to look. Anyway we're almost out of time—anyone got plans for the holidays? I'm thinking of visiting my parents.`;

const AVERAGE_HOST_TRANSCRIPT = `Meeting Hosts: Chris

[0s] Chris: Hello. Agenda: system design, implementation patterns, best practices. I will cover each in order. First, system design. We use a layered architecture. Three layers: data, logic, presentation. The data layer talks to the database and handles persistence. The logic layer holds business rules. The presentation layer renders the UI. Separation is important.
[75s] Bob: How do migrations work in the data layer?
[80s] Chris: Migrations are SQL files run in sequence. Each one alters the schema. We use a version numbering scheme. Run order matters. If two branches change the same table, you resolve manually. CI will fail on conflict. Typically each team owns certain tables.
[150s] Carol: What about the logic layer structure?
[155s] Chris: We organize by domain. Each domain has its own folder. Services handle orchestration. Repositories handle data access. The rule is single responsibility. One module, one job. We avoid cross-domain calls where possible.
[230s] Bob: And the presentation layer?
[235s] Chris: Components. Each screen is built from smaller components. Props flow down. We use a design system with shared tokens for colors and spacing. State management: keep it local first. Lift state only when multiple components need it. Global state is for auth and app-wide config only.
[320s] Carol: Error handling?
[325s] Chris: Each API error maps to a user message. We have an error code table. Never show stack traces. Always give a suggested action. Log details server-side. The frontend shows a generic message plus a retry or contact support option.
[400s] Bob: Onboarding for new engineers?
[405s] Chris: Wiki has setup. Steps: clone repo, install deps, run migrations, start dev server. There is a checklist. New hires pair with someone the first week. Slack channel for questions. The runbook covers deploy and common issues. That is all three areas. Any questions?
[465s] Carol: No.
[467s] Bob: No.
[470s] Chris: Alright. Thanks.`;

test("judge rewards good host who covers all topics", async () => {
	if (!isIntegrationEnv()) return;
	const out = await judge({
		transcript: SAMPLE_TRANSCRIPT,
		goals: SAMPLE_GOALS,
	});

	console.log(out);
}, 30_000);

test("judge penalizes bad host who wastes session on stories", async () => {
	if (!isIntegrationEnv()) return;
	const out = await judge({
		transcript: BAD_HOST_TRANSCRIPT,
		goals: SAMPLE_GOALS,
	});

	console.log(out);
}, 30_000);

test("judge scores average host who teaches steadily and covers everything", async () => {
	// if (!isIntegrationEnv()) return;
	const out = await judge({
		transcript: AVERAGE_HOST_TRANSCRIPT,
		goals: SAMPLE_GOALS,
	});

	console.log(out);
}, 30_000);
