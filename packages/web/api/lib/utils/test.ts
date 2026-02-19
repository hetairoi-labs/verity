import { expect } from "bun:test";

export function isIntegrationEnv() {
	const RUN_INTEGRATION = process.env.INTEGRATION === "true";
	if (!RUN_INTEGRATION) {
		console.log("🔻 [INT ONLY]");
		expect(true).toBe(true);
		return false;
	}
	return true;
}
