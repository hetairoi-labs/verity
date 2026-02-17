import { zValidator as honoZValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";
import { z } from "zod";
import { ApiError } from "./hono/error";
import { safe } from "./safe";

export type ZodErrorDetails = {
	summary: string;
	details: Record<string, string[] | undefined>;
};

export const validator = <
	T extends ZodType,
	Target extends keyof ValidationTargets,
>(
	target: Target,
	schema: T,
) =>
	honoZValidator(target, schema, (result) => {
		if (!result.success) {
			const errorDetails: ZodErrorDetails = {
				summary: z.prettifyError(result.error),
				details: z.flattenError(result.error).fieldErrors,
			};
			throw new ApiError(400, "Zod", errorDetails);
		}
	});

export const zJsonString = () =>
	z
		.string()
		.refine((value) => {
			const [_, error] = safe(() => JSON.parse(value));
			return !error;
		})
		.transform((value) => JSON.parse(value));
