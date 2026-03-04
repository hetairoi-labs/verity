export function isIntegrationEnv() {
	const RUN_INTEGRATION = process.env.INTEGRATION === "true";
	if (!RUN_INTEGRATION) {
		console.log("🔻 [INT ONLY]");
		return false;
	}
	return true;
}
