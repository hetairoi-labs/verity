import { useMutation } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import { client, getAuthHeaders } from "../../utils/hc";
import { usePrivyToken } from "../web3/use-privy-token";

type FaucetRoute = (typeof client.evm.faucet)["$post"];
export type FaucetInput = InferRequestType<FaucetRoute>["json"];

export function useFaucetMutation() {
	const token = usePrivyToken();

	return useMutation({
		mutationFn: async (json: FaucetInput) => {
			if (!token) {
				throw new Error("No auth token");
			}
			const result = await parseResponse(
				client.evm.faucet.$post({ json }, getAuthHeaders(token))
			);
			return result.data;
		},
	});
}
