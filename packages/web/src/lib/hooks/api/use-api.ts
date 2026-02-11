import { useMutation } from "@tanstack/react-query";
import { parseResponse } from "hono/client";
import client from "../../utils/api-client";
import { getApiError } from "../../utils/client-error";

export function useApi() {
	return {
		meet: useMutation({
			mutationFn: async (json: { summary: string }) => {
				const result = await parseResponse(
					client.meet["create-meeting"].$post({ json }),
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
					client.meet["create-bot"].$post({
						json,
					}),
				);
				return result.data;
			},
			onSuccess: (data) => {
				console.log("[createBot mutation] Success:", data);
			},
			onError: (error) =>
				console.error(JSON.stringify(getApiError(error), null, 2)),
		}),
	};
}
