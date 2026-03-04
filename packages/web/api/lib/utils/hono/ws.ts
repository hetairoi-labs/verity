const HTTPS_PREFIX = /^https:\/\//;
const HTTP_PREFIX = /^http:\/\//;

export function getWsUrl() {
	const baseUrl = `${process.env.PUBLIC_APP_URL}/api/v1`;
	const strippedBaseUrl =
		process.env.NODE_ENV === "production"
			? baseUrl.replace(HTTPS_PREFIX, "")
			: baseUrl.replace(HTTP_PREFIX, "");
	const protocol = process.env.NODE_ENV === "production" ? "wss" : "ws";
	return `${protocol}://${strippedBaseUrl}/ws`;
}
