import { useMutation, useQuery } from "@tanstack/react-query";
import { parseResponse } from "hono/client";
import client from "../../utils/api-client";
import { getApiError } from "../../utils/client-error";

export function useApi() {
	return {
		createMeet: useMutation({
			mutationFn: async (json: { summary: string }) => {
				const result = await parseResponse(
					client.meet["create-meeting-with-bot"].$post({ json }),
				);
				return result.data;
			},
			onSuccess: (data) => {
				console.log("[meet mutation] Success:", data);
			},
			onError: (error) =>
				console.error(JSON.stringify(getApiError(error), null, 2)),
		}),

		createBot: useMutation({
			mutationFn: async (json: { meetingUrl: string }) => {
				const result = await parseResponse(
					client.meet["create-bot"].$post({ json }),
				);
				return result.data;
			},
			onSuccess: (data) => {
				console.log("[meet mutation] Success:", data);
			},
			onError: (error) =>
				console.error(JSON.stringify(getApiError(error), null, 2)),
		}),

		getToken: useGetToken,
		getBot: useGetBot,
		getTranscript: useGetTranscript,
	};
}

export function useCreateBot(meetingUrl: string) {
	return useMutation({
		mutationFn: async () => {
			const result = await parseResponse(
				client.meet["create-bot"].$post({ json: { meetingUrl } }),
			);
			return result.data;
		},
		onSuccess: (data) => {
			console.log("[meet mutation] Success:", data);
		},
		onError: (error) =>
			console.error(JSON.stringify(getApiError(error), null, 2)),
	});
}

export function useGetToken() {
	return useQuery({
		queryKey: ["token"],
		queryFn: async () => {
			const result = await parseResponse(client.meet.token.$get());
			return result.data;
		},
		select: (data) => data?.token,
		enabled: true,
	});
}

export function useGetBot(botId: string) {
	return useQuery({
		queryKey: ["bot", botId],
		queryFn: async () => {
			const result = await parseResponse(
				client.meet.bot[":botId"].$get({ param: { botId } }),
			);
			return result.data;
		},
		select: (data) => data?.bot,
		enabled: !!botId,
	});
}

export function useGetTranscript(transcriptUrl: string) {
	return useQuery({
		queryKey: ["transcript", transcriptUrl],
		queryFn: async () => {
			const result = await parseResponse(
				client.meet.transcript[":transcriptUrl"].$get({
					param: { transcriptUrl },
				}),
			);
			return result.data;
		},
		select: (data) => data?.transcript,
		enabled: !!transcriptUrl,
	});
}
