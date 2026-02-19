import { describe, expect, test } from "bun:test";
import { getGeminiEphemeralToken } from "../handlers/gemini";
import { isIntegrationEnv } from "../lib/utils/test";

describe("getGeminiEphemeralToken", () => {
	test("should generate a token", async () => {
		if (!isIntegrationEnv()) return;

		const token = await getGeminiEphemeralToken();
		expect(token.name).toBeDefined();
		expect(typeof token.name).toBe("string");
		expect(token.name?.length).toBeGreaterThan(0);
	});
});
