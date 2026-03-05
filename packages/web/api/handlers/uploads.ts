import { z } from "zod";
import { safeAsync } from "@/lib/utils/safe";
import { ApiError } from "../lib/utils/hono/error";
import { pinata } from "../lib/utils/pinata";

const MIN_EXPIRES_MINUTES = 5;
const MAX_EXPIRES_MINUTES = 60;
const DEFAULT_EXPIRES_MINUTES = 30;
const MAX_NAME_LENGTH = 120;
const MAX_GROUP_LENGTH = 120;
const MAX_KEYVALUES = 20;
const MAX_KEY_LENGTH = 64;
const MAX_VALUE_LENGTH = 256;

export const createJsonPresignedUrlInputSchema = z.object({
	expires: z.coerce
		.number()
		.int("expires must be an integer")
		.min(MIN_EXPIRES_MINUTES)
		.max(MAX_EXPIRES_MINUTES)
		.default(DEFAULT_EXPIRES_MINUTES)
		.optional(),
	name: z.string().min(1).max(MAX_NAME_LENGTH).optional(),
	group: z.string().min(1).max(MAX_GROUP_LENGTH).optional(),
	keyvalues: z
		.record(z.string().max(MAX_KEY_LENGTH), z.string().max(MAX_VALUE_LENGTH))
		.refine((value) => Object.keys(value).length <= MAX_KEYVALUES, {
			message: `keyvalues can include at most ${MAX_KEYVALUES} entries`,
		})
		.optional(),
});

export type CreateJsonPresignedUrlInput = z.input<
	typeof createJsonPresignedUrlInputSchema
>;

export async function createJsonPresignedUrl(
	params: CreateJsonPresignedUrlInput
) {
	const parsed = createJsonPresignedUrlInputSchema.parse(params);
	const expires = parsed.expires ?? DEFAULT_EXPIRES_MINUTES;

	const [signedUrl, signedUrlError] = await safeAsync(
		pinata.upload.public.createSignedURL({
			expires,
			name: parsed.name,
			groupId: parsed.group,
			keyvalues: parsed.keyvalues,
		})
	);

	if (signedUrlError) {
		throw new ApiError(502, "Failed to create presigned URL", {
			reason: signedUrlError.message,
		});
	}

	return {
		signedUrl,
		expires,
	};
}
