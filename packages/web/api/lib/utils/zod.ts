import { zValidator as honoZValidator } from "@hono/zod-validator";
import type { ValidationTargets } from "hono";
import { getAddress, isAddress } from "viem";
import type { ZodType } from "zod";
import { z } from "zod";
import { safe } from "@/lib/utils/safe";

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
		if (!result.success) throw result.error;
	});

export const zJsonString = () =>
	z
		.string()
		.refine((value) => {
			const [_, error] = safe(() => JSON.parse(value));
			return !error;
		})
		.transform((value) => JSON.parse(value));

export const zHexAddress = () =>
	z
		.string()
		.refine((value) => {
			return isAddress(value);
		}, "Invalid hex address")
		.transform((value) => getAddress(value));

export type ZHexAddress = z.infer<ReturnType<typeof zHexAddress>>;

export const zIsoDate = () => z.iso.datetime().pipe(z.coerce.date());
export type ZIsoDate = z.infer<ReturnType<typeof zIsoDate>>;
