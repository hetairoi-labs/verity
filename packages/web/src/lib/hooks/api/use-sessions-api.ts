import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import { client, getAuthHeaders } from "../../utils/hc";
import { usePrivyToken } from "../web3/use-privy-token";
import { qk } from "./query-keys";

// get all sessions
type GetAllSessionsRoute = (typeof client.sessions.all)["$get"];
export type GetAllSessionsInput =
	InferRequestType<GetAllSessionsRoute>["query"];

export function useGetAllSessionsQuery(params?: GetAllSessionsInput) {
	const token = usePrivyToken();
	return useQuery({
		queryKey: qk.sessions.all(params),
		queryFn: async () => {
			const result = await parseResponse(
				client.sessions.all.$get(
					{ query: params || {} },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
			);
			return result.data;
		},
		select: (data) => data?.sessions,
		enabled: !!token,
	});
}

// get session by id
type GetSessionByIdRoute = (typeof client.sessions.session)["$get"];
export type GetSessionByIdInput =
	InferRequestType<GetSessionByIdRoute>["query"];

export function useGetSessionByIdQuery(params: GetSessionByIdInput) {
	const token = usePrivyToken();
	return useQuery({
		queryKey: qk.sessions.byId(params.sessionId),
		queryFn: async () => {
			const result = await parseResponse(
				client.sessions.session.$get(
					{ query: params },
					getAuthHeaders(token ?? "")
				)
			);
			return result.data;
		},
		select: (data) => data?.session,
		enabled: !!token && !!params.sessionId,
	});
}

// create session
type CreateSessionRoute = (typeof client.sessions)["$post"];
export type CreateSessionInput = InferRequestType<CreateSessionRoute>["json"];

export function useCreateSessionMutation() {
	const token = usePrivyToken();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (json: CreateSessionInput) => {
			if (!token) {
				throw new Error("No auth token");
			}
			const result = await parseResponse(
				client.sessions.$post(
					{ json },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
			);
			return result.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: qk.sessions.all() });
			queryClient.invalidateQueries({ queryKey: qk.sessions.host() });
			queryClient.invalidateQueries({ queryKey: qk.sessions.metrics() });
		},
	});
}

// update session
type UpdateSessionRoute = (typeof client.sessions)["$patch"];
export type UpdateSessionInput = InferRequestType<UpdateSessionRoute>["json"];

export type UpdateSessionVariables = UpdateSessionInput & { sessionId: number };

export function useUpdateSessionMutation() {
	const token = usePrivyToken();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (variables: UpdateSessionVariables) => {
			if (!token) {
				throw new Error("No auth token");
			}
			const { sessionId: _sessionId, ...json } = variables;
			const result = await parseResponse(
				client.sessions.$patch(
					{ json },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
			);
			return result.data;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: qk.sessions.byId(variables.sessionId),
			});
			queryClient.invalidateQueries({ queryKey: qk.sessions.host() });
			queryClient.invalidateQueries({ queryKey: qk.sessions.metrics() });
		},
	});
}

// get host sessions
type GetHostSessionsRoute = (typeof client.sessions.host)["$get"];
export type GetHostSessionsInput =
	InferRequestType<GetHostSessionsRoute>["query"];

export function useGetHostSessionsQuery(params?: GetHostSessionsInput) {
	const token = usePrivyToken();
	return useQuery({
		queryKey: qk.sessions.host(params),
		queryFn: async () => {
			const result = await parseResponse(
				client.sessions.host.$get(
					{ query: params || {} },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
			);
			return result.data;
		},
		select: (data) => data?.sessions,
		enabled: !!token,
	});
}

// delete session
type DeleteSessionRoute = (typeof client.sessions.session)["$delete"];
export type DeleteSessionInput = InferRequestType<DeleteSessionRoute>["json"];

export function useDeleteSessionMutation() {
	const token = usePrivyToken();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (json: DeleteSessionInput) => {
			if (!token) {
				throw new Error("No auth token");
			}
			const result = await parseResponse(
				client.sessions.session.$delete(
					{ json },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
			);
			return result.data;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: qk.sessions.byId(String(variables.sessionId)),
			});
			queryClient.invalidateQueries({ queryKey: qk.sessions.host() });
			queryClient.invalidateQueries({ queryKey: qk.sessions.history() });
			queryClient.invalidateQueries({ queryKey: qk.sessions.metrics() });
		},
	});
}

// get history sessions
type GetSessionHistoryRoute = (typeof client.sessions.history)["$get"];
export type GetSessionHistoryInput =
	InferRequestType<GetSessionHistoryRoute>["query"];

export function useGetSessionHistoryQuery(params?: GetSessionHistoryInput) {
	const token = usePrivyToken();
	return useQuery({
		queryKey: qk.sessions.history(params),
		queryFn: async () => {
			const result = await parseResponse(
				client.sessions.history.$get(
					{ query: params || {} },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
			);
			return result.data;
		},
		select: (data) => data?.sessions,
		enabled: !!token,
	});
}

export function useGetDashboardMetricsQuery() {
	const token = usePrivyToken();
	return useQuery({
		queryKey: qk.sessions.metrics(),
		queryFn: async () => {
			const result = await parseResponse(
				client.sessions.dashboard.metrics.$get(undefined, {
					headers: { Authorization: `Bearer ${token}` },
				})
			);
			return result.data;
		},
		select: (data) => data?.metrics,
		enabled: !!token,
	});
}

// enroll participant
type EnrollParticipantRoute =
	(typeof client.sessions.participants.enroll)["$post"];
export type EnrollParticipantInput =
	InferRequestType<EnrollParticipantRoute>["json"];

export function useEnrollParticipantMutation() {
	const token = usePrivyToken();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (json: EnrollParticipantInput) => {
			if (!token) {
				throw new Error("No auth token");
			}
			const result = await parseResponse(
				client.sessions.participants.enroll.$post(
					{ json },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
			);
			return result.data;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: qk.sessions.byId(String(variables.sessionId)),
			});
			queryClient.invalidateQueries({ queryKey: qk.sessions.history() });
			queryClient.invalidateQueries({ queryKey: qk.sessions.metrics() });
		},
	});
}

export type GetAllSessionsResponse = Awaited<
	ReturnType<typeof useGetAllSessionsQuery>
>["data"];
export type GetSessionByIdResponse = Awaited<
	ReturnType<typeof useGetSessionByIdQuery>
>["data"];
export type CreateSessionResponse = Awaited<
	ReturnType<typeof useCreateSessionMutation>
>["data"];
export type UpdateSessionResponse = Awaited<
	ReturnType<typeof useUpdateSessionMutation>
>["data"];
export type GetHostSessionsResponse = Awaited<
	ReturnType<typeof useGetHostSessionsQuery>
>["data"];
export type DeleteSessionResponse = Awaited<
	ReturnType<typeof useDeleteSessionMutation>
>["data"];
export type GetSessionHistoryResponse = Awaited<
	ReturnType<typeof useGetSessionHistoryQuery>
>["data"];
export type GetDashboardMetricsResponse = Awaited<
	ReturnType<typeof useGetDashboardMetricsQuery>
>["data"];
export type EnrollParticipantResponse = Awaited<
	ReturnType<typeof useEnrollParticipantMutation>
>["data"];
