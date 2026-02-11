import { zValidator as honoZValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import type { ZodType } from "zod";
import { z } from "zod";
import { AppError } from "./hono/error";

export const validator = <
	T extends ZodType,
	Target extends keyof ValidationTargets,
>(
	target: Target,
	schema: T,
) =>
	honoZValidator(target, schema, (result) => {
		if (!result.success) {
			const errorDetails = {
				type: "zod",
				summary: z.prettifyError(result.error),
				details: z.flattenError(result.error).fieldErrors,
			};
			throw new AppError("Input validation failed", 400, errorDetails);
		}
	});

export const zJsonString = () =>
	z
		.string()
		.refine((value) => {
			try {
				JSON.parse(value);
				return true;
			} catch (_) {
				return false;
			}
		})
		.transform((value) => JSON.parse(value));
