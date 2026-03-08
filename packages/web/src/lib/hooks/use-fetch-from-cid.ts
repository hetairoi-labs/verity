import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import { toGatewayUrl } from "@/src/lib/utils/pinata";

interface UseFetchFromCidInput<TSchema extends z.ZodTypeAny> {
	cid: string | undefined;
	queryKeyPrefix?: string;
	schema: TSchema;
}

export function useFetchFromCid<TSchema extends z.ZodTypeAny>({
	cid,
	schema,
	queryKeyPrefix = "fetchFromCid",
}: UseFetchFromCidInput<TSchema>) {
	return useQuery({
		queryKey: [queryKeyPrefix, cid],
		queryFn: async () => {
			if (!cid) {
				return undefined;
			}
			const response = await fetch(toGatewayUrl(cid));
			const payload = (await response.json()) as unknown;
			return schema.parse(payload);
		},
		enabled: Boolean(cid),
	});
}
