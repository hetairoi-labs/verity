import { useQuery } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import client from "../../utils/api-client";

// get live token
type GetLiveTokenRoute = (typeof client.ai.live.token)["$get"];
export type GetLiveTokenInput = InferRequestType<GetLiveTokenRoute>;

export function useGetLiveTokenQuery(enabled: boolean) {
	return useQuery({
		queryKey: ["live-token"],
		queryFn: async () => {
			const result = await parseResponse(client.ai.live.token.$get());
			return result.data;
		},
		select: (data) => data?.token,
		enabled,
	});
}

export type GetLiveTokenResponse = Awaited<
	ReturnType<typeof useGetLiveTokenQuery>
>["data"];
