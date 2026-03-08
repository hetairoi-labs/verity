import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import { toGatewayUrl } from "@/src/lib/utils/pinata";

const HTTP_PROTOCOL_REGEX = /^https?:\/\//i;

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
			const targetUrl = HTTP_PROTOCOL_REGEX.test(cid) ? cid : toGatewayUrl(cid);
			const response = await fetch(targetUrl);
			const payload = (await response.json()) as unknown;
			return schema.parse(payload);
		},
		enabled: Boolean(cid),
	});
}
