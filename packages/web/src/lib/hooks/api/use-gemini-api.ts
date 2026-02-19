import { useQuery } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import client from "../../utils/api-client";

// get ephemeral gemini token
type GetEphemeralTokenRoute = (typeof client.gemini)["token"]["$get"];
export type GetEphemeralTokenInput = InferRequestType<GetEphemeralTokenRoute>;

export function useGetEphemeralTokenQuery(enabled: boolean) {
	return useQuery({
		queryKey: ["ephemeral-token"],
		queryFn: async () => {
			const result = await parseResponse(client.gemini.token.$get());
			return result.data;
		},
		select: (data) => data?.token,
		enabled,
	});
}
