import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import { type ClientResponse, parseResponse } from "hono/client";
import type { StatusCode } from "hono/utils/http-status";
import {
	type ApiClientErrorResponse,
	getApiError,
} from "../../utils/client-error";

export function useApiMutation<TData, TVariables>(
	requestFn: (
		variables: TVariables,
	) =>
		| ClientResponse<unknown, StatusCode, string>
		| Promise<ClientResponse<unknown, StatusCode, string>>,
	name?: string,
	options?: Omit<UseMutationOptions<TData, unknown, TVariables>, "mutationFn">,
) {
	const { onSuccess, onError, ...restOptions } = options || {};

	const mutation = useMutation({
		mutationFn: async (variables: TVariables) => {
			const response = await requestFn(variables);
			const parsed = await parseResponse(response);
			const result = parsed as unknown as { data: TData };
			return result.data;
		},
		onSuccess: (data, variables, context, mutation) => {
			if (name) {
				console.log(`[${name} mutation success]:`, data);
			}
			onSuccess?.(data, variables, context, mutation);
		},
		onError: (error, variables, context, mutation) => {
			console.error(
				`[${name} mutation error]:`,
				JSON.stringify(getApiError(error), null, 2),
			);
			onError?.(error, variables, context, mutation);
		},
		...restOptions,
	});

	return {
		...mutation,
		error: mutation.error ? getApiError(mutation.error) : undefined,
	} as Omit<typeof mutation, "error"> & {
		error: ApiClientErrorResponse | undefined;
	};
}
