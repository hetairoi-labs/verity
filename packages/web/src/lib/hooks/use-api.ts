import { useMutation } from "@tanstack/react-query";
import client from "../utils/api-client";

export function useApi() {
	return {
		meet: useMutation({
			mutationFn: async (options: { summary: string }) => {
				const res = await client.meet["create-meeting"].$post({
					json: options,
				});
				const parsed = await res.json();
				if (!parsed.success) {
					throw new Error(parsed.error);
				}
				return parsed.data;
			},
			onSuccess: (data) => {
				console.log(data);
			},
			onError: (err) => {
				console.error(err);
			},
		}),
	};
}
