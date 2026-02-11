export function getWsUrl() {
	const baseUrl = process.env.PUBLIC_SERVER_URL;
	const strippedBaseUrl =
		process.env.NODE_ENV === "production"
			? baseUrl.replace(/^https:\/\//, "")
			: baseUrl.replace(/^http:\/\//, "");
	const protocol = process.env.NODE_ENV === "production" ? "wss" : "ws";

	const wsUrl = `${protocol}://${strippedBaseUrl}/ws`;
	return wsUrl;
}
