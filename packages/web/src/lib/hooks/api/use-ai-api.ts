import { useQuery } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import { receiveTypedStream } from "hono-typedstream/client";
import client from "../../utils/api-client";
import { usePrivyToken } from "../web3/use-privy-token";

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

// fast text streaming
type FastTextRoute = (typeof client.ai.text.fast)["$post"];
export type FastTextInput = InferRequestType<FastTextRoute>["json"];

export function useFastTextStream() {
	const token = usePrivyToken();

	const streamText = async (input: FastTextInput) => {
		if (!token) throw new Error("No auth token");

		const response = await client.ai.text.fast.$post(
			{ json: input },
			{ headers: { Authorization: `Bearer ${token}` } },
		);

		return receiveTypedStream(response);
	};

	return { streamText };
}

// fast chat streaming
type FastChatRoute = (typeof client.ai.chat.fast)["$post"];
export type FastChatInput = InferRequestType<FastChatRoute>["json"];

export function useFastChatStream() {
	const token = usePrivyToken();

	const streamChat = async (input: FastChatInput) => {
		if (!token) throw new Error("No auth token");

		const response = await client.ai.chat.fast.$post(
			{ json: input },
			{ headers: { Authorization: `Bearer ${token}` } },
		);

		return receiveTypedStream(response);
	};

	return { streamChat };
}

export type GetLiveTokenResponse = Awaited<
	ReturnType<typeof useGetLiveTokenQuery>
>["data"];
export type FastTextChunk = { text: string };
export type FastChatChunk = { text: string };
