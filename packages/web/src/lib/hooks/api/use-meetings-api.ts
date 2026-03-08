import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import { client, getAuthHeaders } from "../../utils/hc";
import { usePrivyToken } from "../web3/use-privy-token";
import { qk } from "./query-keys";

// create meeting
type CreateMeetingRoute = (typeof client.sessions.meetings)["$post"];
export type CreateMeetingInput = InferRequestType<CreateMeetingRoute>["json"];

export function useCreateMeetingMutation() {
	const token = usePrivyToken();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (json: CreateMeetingInput) => {
			if (!token) {
				throw new Error("Unauthorized: No auth token");
			}
			const result = await parseResponse(
				client.sessions.meetings.$post({ json }, getAuthHeaders(token))
			);
			return result.data;
		},
		onSuccess: (_data, variables) => {
			queryClient.invalidateQueries({
				queryKey: qk.meetings.bySession(variables.sessionId),
			});
			queryClient.invalidateQueries({
				queryKey: qk.sessions.byId(variables.sessionId),
			});
			queryClient.invalidateQueries({ queryKey: qk.sessions.metrics() });
		},
	});
}

// get meetings by session
type GetSessionMeetingsRoute = (typeof client.sessions.meetings.all)["$get"];
export type GetSessionMeetingsInput =
	InferRequestType<GetSessionMeetingsRoute>["query"];

export function useGetSessionMeetingsQuery(params?: GetSessionMeetingsInput) {
	const token = usePrivyToken();
	const sessionId = params?.sessionId ?? "all";
	return useQuery({
		queryKey: qk.meetings.bySession(sessionId, params),
		queryFn: async () => {
			if (!token) {
				throw new Error("Unauthorized: No auth token");
			}
			const result = await parseResponse(
				client.sessions.meetings.all.$get(
					{ query: params || {} },
					getAuthHeaders(token)
				)
			);
			return result.data;
		},
		select: (data) => data?.meetings,
		enabled: !!token,
	});
}

// get meeting by id
type GetMeetingByIdRoute = (typeof client.sessions.meetings.meeting)["$get"];
export type GetMeetingByIdInput =
	InferRequestType<GetMeetingByIdRoute>["query"];

export function useGetMeetingByIdQuery(params: GetMeetingByIdInput) {
	const token = usePrivyToken();
	return useQuery({
		queryKey: qk.meetings.byId(params.meetingId),
		queryFn: async () => {
			if (!token) {
				throw new Error("Unauthorized: No auth token");
			}
			const result = await parseResponse(
				client.sessions.meetings.meeting.$get(
					{ query: params },
					getAuthHeaders(token)
				)
			);
			return result.data;
		},
		select: (data) => data?.meeting,
		enabled: !!token && !!params.meetingId,
	});
}

// delete meeting
type DeleteMeetingRoute = (typeof client.sessions.meetings)["$delete"];
export type DeleteMeetingInput = InferRequestType<DeleteMeetingRoute>["json"];

export function useDeleteMeetingMutation() {
	const token = usePrivyToken();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (json: DeleteMeetingInput) => {
			if (!token) {
				throw new Error("Unauthorized: No auth token");
			}
			const result = await parseResponse(
				client.sessions.meetings.$delete({ json }, getAuthHeaders(token))
			);
			return result.data;
		},
		onSuccess: (data) => {
			console.log("[DeleteMeetingMutation] Success:", data);
			queryClient.invalidateQueries({ queryKey: qk.meetings.root() });
			queryClient.invalidateQueries({ queryKey: qk.sessions.root() });
			queryClient.invalidateQueries({ queryKey: qk.sessions.metrics() });
		},
	});
}

// resolve meeting index from CRE tx hash
type ResolveMeetingIndexRoute =
	(typeof client.sessions.meetings.meeting)["$patch"];
export type ResolveMeetingIndexInput =
	InferRequestType<ResolveMeetingIndexRoute>["json"];

export function useResolveMeetingIndexMutation() {
	const token = usePrivyToken();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (json: ResolveMeetingIndexInput) => {
			if (!token) {
				throw new Error("Unauthorized: No auth token");
			}
			const result = await parseResponse(
				client.sessions.meetings.meeting.$patch({ json }, getAuthHeaders(token))
			);
			return result.data;
		},
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries({
				queryKey: qk.meetings.byId(variables.meetingId),
			});
			const sessionId = data?.meeting?.sessionId;
			if (sessionId != null) {
				queryClient.invalidateQueries({
					queryKey: qk.meetings.bySession(sessionId),
				});
			}
			queryClient.invalidateQueries({ queryKey: qk.sessions.metrics() });
		},
	});
}

export type CreateMeetingResponse = NonNullable<
	Awaited<ReturnType<typeof useCreateMeetingMutation>>["data"]
>;
export type GetSessionMeetingsResponse = NonNullable<
	Awaited<ReturnType<typeof useGetSessionMeetingsQuery>>["data"]
>;
export type GetMeetingByIdResponse = NonNullable<
	Awaited<ReturnType<typeof useGetMeetingByIdQuery>>["data"]
>;
export type DeleteMeetingResponse = NonNullable<
	Awaited<ReturnType<typeof useDeleteMeetingMutation>>["data"]
>;
export type ResolveMeetingIndexResponse = NonNullable<
	Awaited<ReturnType<typeof useResolveMeetingIndexMutation>>["data"]
>;
