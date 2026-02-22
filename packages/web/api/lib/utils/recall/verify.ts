/**
 * Verify webhook requests from Recall.ai using the Svix signing secret.
 * @see https://docs.recall.ai/docs/authenticating-requests-from-recallai
 */

import crypto from "node:crypto";
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
		const lower = key.toLowerCase();
		return h[lower] ?? h[key] ?? null;
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
		throw new ApiError(
			401,
			"Missing webhook headers (webhook-id, webhook-timestamp, webhook-signature)",
			{
				msgId,
				msgTimestamp,
				msgSignature,
			},
		);
	}

	const prefix = "whsec_";
	const base64Part = secret.startsWith(prefix)
		? secret.slice(prefix.length)
		: secret;
	const key = Buffer.from(base64Part, "base64");

	const toSign = `${msgId}.${msgTimestamp}.${payload}`;
	const expectedSig = crypto
		.createHmac("sha256", key)
		.update(toSign)
		.digest("base64");

	const passedSigs = msgSignature.split(" ");
	for (const versionedSig of passedSigs) {
		const commaIdx = versionedSig.indexOf(",");
		const version = versionedSig.slice(0, commaIdx);
		const signature = commaIdx >= 0 ? versionedSig.slice(commaIdx + 1) : "";
		if (version !== "v1" || !signature) continue;

		const sigBytes = Buffer.from(signature, "base64");
		const expectedSigBytes = Buffer.from(expectedSig, "base64");
		if (
			expectedSigBytes.length === sigBytes.length &&
			crypto.timingSafeEqual(
				new Uint8Array(expectedSigBytes),
				new Uint8Array(sigBytes),
			)
		) {
			return;
		}
	}

	throw new ApiError(401, "Recall webhook signature verification failed");
}
