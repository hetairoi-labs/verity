import { useMutation, useQuery } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import client from "@/src/lib/utils/api-client";

// get bot by id
type GetBotRoute = (typeof client.meet)["bot"]["$get"];
export type GetBotInput = InferRequestType<GetBotRoute>["query"];

export function useGetBotQuery(query: GetBotInput) {
	return useQuery({
		queryKey: ["bot", query.botId],
		queryFn: async () => {
			const result = await parseResponse(client.meet.bot.$get({ query }));
			return result.data;
		},
		select: (data) => data?.bot,
		enabled: !!query.botId,
	});
}

// create new meeting
type CreateEventRoute = (typeof client.meet)["create-event"]["$post"];
export type CreateEventInput = InferRequestType<CreateEventRoute>["json"];

export function useCreateEventMutation() {
	return useMutation({
		mutationFn: async (json: CreateEventInput) => {
			const result = await parseResponse(
				client.meet["create-event"].$post({ json }),
			);
			return result.data;
		},
		onSuccess: (data) => {
			console.log("[meet mutation] Success:", data);
		},
	});
}

// create a new bot for a given meeting
type CreateBotRoute = (typeof client.meet)["create-bot"]["$post"];
export type CreateBotInput = InferRequestType<CreateBotRoute>["json"];

export function useCreateBotMutation() {
	return useMutation({
		mutationFn: async (json: CreateBotInput) => {
			const result = await parseResponse(
				client.meet["create-bot"].$post({ json }),
			);
			return result.data;
		},
		onSuccess: (data) => {
			console.log("[meet mutation] Success:", data);
		},
	});
}

// get transcript by url
type GetTranscriptRoute = (typeof client.meet)["transcript"]["$get"];
export type GetTranscriptInput = InferRequestType<GetTranscriptRoute>["query"];

export function useGetTranscriptQuery(query: GetTranscriptInput) {
	return useQuery({
		queryKey: ["transcript", query.transcriptUrl],
		queryFn: async () => {
			const result = await parseResponse(
				client.meet.transcript.$get({ query }),
			);
			return result.data;
		},
		select: (data) => data?.transcript,
		enabled: !!query.transcriptUrl,
	});
}

// get ephemeral gemini token
type GetEphemeralTokenRoute = (typeof client.meet)["token"]["$get"];
export type GetEphemeralTokenInput = InferRequestType<GetEphemeralTokenRoute>;

export function useGetEphemeralTokenQuery(enabled: boolean) {
	return useQuery({
		queryKey: ["ephemeral-token"],
		queryFn: async () => {
			const result = await parseResponse(client.meet.token.$get());
			return result.data;
		},
		select: (data) => data?.token,
		enabled,
	});
}
