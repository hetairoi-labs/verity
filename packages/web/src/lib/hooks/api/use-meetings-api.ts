import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import client from "../../utils/api-client";
import { usePrivyToken } from "../web3/use-privy-token";

// create meeting
type CreateMeetingRoute = (typeof client.sessions.meetings)["$post"];
export type CreateMeetingInput = InferRequestType<CreateMeetingRoute>["json"];

export function useCreateMeetingMutation() {
	const token = usePrivyToken();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (json: CreateMeetingInput) => {
			if (!token) throw new Error("No auth token");
			const result = await parseResponse(
				client.sessions.meetings.$post(
					{ json },
					{ headers: { Authorization: `Bearer ${token}` } },
				),
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
	const token = usePrivyToken();
	return useQuery({
		queryKey: ["meetings", "all", params],
		queryFn: async () => {
			const result = await parseResponse(
				client.sessions.meetings.all.$get(
					{ query: params || {} },
					{ headers: { Authorization: `Bearer ${token}` } },
				),
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
		queryKey: ["meetings", "meeting", params.meetingId],
		queryFn: async () => {
			const result = await parseResponse(
				client.sessions.meetings.meeting.$get(
					{ query: params },
					{ headers: { Authorization: `Bearer ${token}` } },
				),
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
			if (!token) throw new Error("No auth token");
			const result = await parseResponse(
				client.sessions.meetings.$delete(
					{ json },
					{ headers: { Authorization: `Bearer ${token}` } },
				),
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
