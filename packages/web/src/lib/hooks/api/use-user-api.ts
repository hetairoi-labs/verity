import { useMutation } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import client from "../../utils/api-client";
import { usePrivyToken } from "../wallet/use-privy-token";

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
			console.log("[register user mutation] Success:", data);
		},
	});
}
