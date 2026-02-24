import { describe, expect, test } from "bun:test";
import { streamTextCerebras } from "../lib/utils/cerebras";
import { isIntegrationEnv } from "../lib/utils/tests";

describe("streamTextCerebras", () => {
	test(
		"logs streamed response",
		async () => {
			if (!isIntegrationEnv()) return;

			const chunks: string[] = [];
			for await (const chunk of streamTextCerebras(
				"Reply with one short sentence saying hello from Cerebras.",
			)) {
				chunks.push(chunk);
			}

			const response = chunks.join("").trim();
			console.log("[cerebras response]", response);

			expect(response.length).toBeGreaterThan(0);
		},
		{ timeout: 60_000 },
	);
});
