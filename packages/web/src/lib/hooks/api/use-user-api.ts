import { usePrivy } from "@privy-io/react-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import { client, getAuthHeaders } from "../../utils/hc";

// register new user
type RegisterUserRoute = (typeof client.users)["$post"];
export type RegisterUserInput = InferRequestType<RegisterUserRoute>["json"];

export function useRegisterUserMutation() {
	const { getAccessToken } = usePrivy();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (json: RegisterUserInput) => {
			const token = await getAccessToken();
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
	const { getAccessToken, authenticated, ready } = usePrivy();
	return useQuery({
		queryKey: ["user"],
		queryFn: async () => {
			const token = await getAccessToken();
			if (!token) {
				throw new Error("No auth token");
			}
			const result = await parseResponse(
				client.users.$get({}, getAuthHeaders(token))
			);
			return result.data;
		},
		select: (data) => data?.user,
		enabled: ready && authenticated,
	});
}

// delete user
export function useDeleteUserMutation() {
	const { getAccessToken } = usePrivy();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			const token = await getAccessToken();
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
