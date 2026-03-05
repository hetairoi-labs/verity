import { usePrivy } from "@privy-io/react-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import { client, getAuthHeaders } from "../../utils/hc";

// create meeting
type CreateMeetingRoute = (typeof client.sessions.meetings)["$post"];
export type CreateMeetingInput = InferRequestType<CreateMeetingRoute>["json"];

export function useCreateMeetingMutation() {
	const { getAccessToken } = usePrivy();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (json: CreateMeetingInput) => {
			const token = await getAccessToken();
			if (!token) {
				throw new Error("Unauthorized: No auth token");
			}
			const result = await parseResponse(
				client.sessions.meetings.$post({ json }, getAuthHeaders(token))
			);
			return result.data;
		},
		onSuccess: (data) => {
			console.log("[CreateMeetingMutation] Success:", data);
			queryClient.invalidateQueries({ queryKey: ["meetings"] });
		},
	});
}

// get meetings by session
type GetSessionMeetingsRoute = (typeof client.sessions.meetings.all)["$get"];
export type GetSessionMeetingsInput =
	InferRequestType<GetSessionMeetingsRoute>["query"];

export function useGetSessionMeetingsQuery(params?: GetSessionMeetingsInput) {
	const { getAccessToken, authenticated, ready } = usePrivy();
	return useQuery({
		queryKey: ["meetings", "all", params],
		queryFn: async () => {
			const token = await getAccessToken();
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
		enabled: ready && authenticated,
	});
}

// get meeting by id
type GetMeetingByIdRoute = (typeof client.sessions.meetings.meeting)["$get"];
export type GetMeetingByIdInput =
	InferRequestType<GetMeetingByIdRoute>["query"];

export function useGetMeetingByIdQuery(params: GetMeetingByIdInput) {
	const { getAccessToken, authenticated, ready } = usePrivy();
	return useQuery({
		queryKey: ["meetings", "meeting", params.meetingId],
		queryFn: async () => {
			const token = await getAccessToken();
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
		enabled: ready && authenticated && !!params.meetingId,
	});
}

// delete meeting
type DeleteMeetingRoute = (typeof client.sessions.meetings)["$delete"];
export type DeleteMeetingInput = InferRequestType<DeleteMeetingRoute>["json"];

export function useDeleteMeetingMutation() {
	const { getAccessToken } = usePrivy();
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (json: DeleteMeetingInput) => {
			const token = await getAccessToken();
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
			queryClient.invalidateQueries({ queryKey: ["meetings"] });
		},
	});
}

export type CreateMeetingResponse = Awaited<
	ReturnType<typeof useCreateMeetingMutation>
>["data"];
export type GetSessionMeetingsResponse = Awaited<
	ReturnType<typeof useGetSessionMeetingsQuery>
>["data"];
export type GetMeetingByIdResponse = Awaited<
	ReturnType<typeof useGetMeetingByIdQuery>
>["data"];
export type DeleteMeetingResponse = Awaited<
	ReturnType<typeof useDeleteMeetingMutation>
>["data"];
