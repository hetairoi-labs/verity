/**
 * Verify webhook requests from Recall.ai using the Svix signing secret.
 * @see https://docs.recall.ai/docs/authenticating-requests-from-recallai
 */
import { ApiError } from "../hono/error";

export function verifyRecallWebhook(args: {
	secret: string;
	headers: Headers | Record<string, string>;
	payload: string;
}): void {
	const { secret, payload } = args;

	const getHeader = (key: string): string | null => {
		const h = args.headers;
		if (h instanceof Headers) {
			return h.get(key) ?? h.get(key.toLowerCase());
		}
		return h[key.toLowerCase()] ?? h[key] ?? null;
	};

	const msgId = getHeader("webhook-id") ?? getHeader("svix-id");
	const msgTimestamp =
		getHeader("webhook-timestamp") ?? getHeader("svix-timestamp");
	const msgSignature =
		getHeader("webhook-signature") ?? getHeader("svix-signature");

	if (!secret || !secret.startsWith("whsec_")) {
		throw new ApiError(401, "Recall webhook secret is missing or invalid");
	}

	if (!msgId || !msgTimestamp || !msgSignature) {
		throw new ApiError(401, "Missing webhook headers", {
			msgId,
			msgTimestamp,
			msgSignature,
		});
	}

	// Decode the base64 secret key
	const base64Part = secret.startsWith("whsec_") ? secret.slice(6) : secret;
	const key = Buffer.from(base64Part, "base64");

	// Bun-native HMAC generation
	const toSign = `${msgId}.${msgTimestamp}.${payload}`;
	const hmac = new Bun.CryptoHasher("sha256", key);
	hmac.update(toSign);
	const expectedSigBase64 = hmac.digest("base64");

	const passedSigs = msgSignature.split(" ");
	for (const versionedSig of passedSigs) {
		const [version, signature] = versionedSig.split(",");
		if (version !== "v1" || !signature) continue;

		const sigBytes = Buffer.from(signature, "base64");
		const expectedBytes = Buffer.from(expectedSigBase64, "base64");

		if (crypto.timingSafeEqual(sigBytes, expectedBytes)) {
			return;
		}
	}

	throw new ApiError(401, "Recall webhook signature verification failed");
}
