import { useMutation } from "@tanstack/react-query";
import client from "../utils/api-client";

export function useApi() {
	return {
		google: useMutation({
			mutationFn: async () => {
				const res = await client.google["create-meeting"].$post();
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
