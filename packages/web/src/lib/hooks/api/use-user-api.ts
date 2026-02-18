import { useMutation, useQuery } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import client from "../../utils/api-client";
import { usePrivyToken } from "../web3/use-privy-token";

// register new user
type RegisterUserRoute = (typeof client.users)["index"]["$post"];
export type RegisterUserInput = InferRequestType<RegisterUserRoute>["json"];

export function useRegisterUserMutation() {
	const token = usePrivyToken();
	return useMutation({
		mutationFn: async (json: RegisterUserInput) => {
			if (!token) throw new Error("Authentication required");
			const result = await parseResponse(
				client.users.index.$post(
					{ json },
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result.data;
		},
		onSuccess: (data) => {
			console.log("[RegisterUserMutation] Success:", data);
		},
	});
}

type GetUserRoute = (typeof client.users)["index"]["$get"];
export type GetUserInput = InferRequestType<GetUserRoute>;

export function useGetUserQuery() {
	const token = usePrivyToken();
	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const result = await parseResponse(
				client.users.index.$get(
					{},
					{ headers: { Authorization: `Bearer ${token}` } },
				),
			);
			return result.data;
		},
		select: (data) => data?.user,
		enabled: !!token,
	});
}
