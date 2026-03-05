import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import { client, getAuthHeaders } from "../../utils/hc";
import { usePrivyToken } from "../web3/use-privy-token";

// register new user
type RegisterUserRoute = (typeof client.users)["$post"];
export type RegisterUserInput = InferRequestType<RegisterUserRoute>["json"];

export function useRegisterUserMutation() {
	const token = usePrivyToken();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (json: RegisterUserInput) => {
			if (!token) {
				throw new Error("No auth token");
			}
			const result = await parseResponse(
				client.users.$post({ json }, getAuthHeaders(token))
			);
			return result.data;
		},
		onSuccess: (data) => {
			console.log("[RegisterUserMutation] Success:", data);
			queryClient.invalidateQueries({ queryKey: ["user", data?.user?.id] });
		},
	});
}

// get authenticated user
type GetUserRoute = (typeof client.users)["$get"];
export type GetUserInput = InferRequestType<GetUserRoute>;

export function useGetUserQuery() {
	const token = usePrivyToken();
	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			if (!token) {
				throw new Error("No auth token");
			}
			const result = await parseResponse(
				client.users.$get({}, getAuthHeaders(token))
			);
			return result.data;
		},
		select: (data) => data?.user,
		enabled: !!token,
	});
}

// delete user
export function useDeleteUserMutation() {
	const token = usePrivyToken();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			if (!token) {
				throw new Error("No auth token");
			}
			const result = await parseResponse(
				client.users.$delete({}, getAuthHeaders(token))
			);
			return result.data;
		},
		onSuccess: (data) => {
			console.log("[DeleteUserMutation] Success:", data);
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});
}

export type GetUserResponse = Awaited<
	ReturnType<typeof useGetUserQuery>
>["data"];
export type RegisterUserResponse = Awaited<
	ReturnType<typeof useRegisterUserMutation>
>["data"];
export type DeleteUserResponse = Awaited<
	ReturnType<typeof useDeleteUserMutation>
>["data"];
