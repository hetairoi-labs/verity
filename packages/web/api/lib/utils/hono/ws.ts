export function getWsUrl() {
	const baseUrl = `${process.env.PUBLIC_APP_URL}/api/v1`;
	const strippedBaseUrl =
		process.env.NODE_ENV === "production"
			? baseUrl.replace(/^https:\/\//, "")
			: baseUrl.replace(/^http:\/\//, "");
	const protocol = process.env.NODE_ENV === "production" ? "wss" : "ws";
	return `${protocol}://${strippedBaseUrl}/ws`;
}
