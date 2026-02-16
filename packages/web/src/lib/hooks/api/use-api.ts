import type {
	CreateBotInput,
	CreateMeetInput,
	GetBotInput,
	GetEphemeralTokenInput,
	GetTranscriptInput,
} from "./use-meet-api";
import {
	useCreateBotMutation,
	useCreateMeetMutation,
	useGetBotQuery,
	useGetEphemeralTokenQuery,
	useGetTranscriptQuery,
} from "./use-meet-api";

export function useApi() {
	return {
		createMeet: useCreateMeetMutation(),
		createBot: useCreateBotMutation(),
		getBot: useGetBotQuery,
		getTranscript: useGetTranscriptQuery,
		getToken: useGetEphemeralTokenQuery,
	};
}

export type ApiRequestTypes = {
	createMeet: CreateMeetInput;
	createBot: CreateBotInput;
	getBot: GetBotInput;
	getTranscript: GetTranscriptInput;
	getToken: GetEphemeralTokenInput;
};

export type ApiResponseTypes = {
	createMeet: Awaited<ReturnType<typeof useCreateMeetMutation>>["data"];
	createBot: Awaited<ReturnType<typeof useCreateBotMutation>>["data"];
	getBot: Awaited<ReturnType<typeof useGetBotQuery>>["data"];
	getTranscript: Awaited<ReturnType<typeof useGetTranscriptQuery>>["data"];
	getToken: Awaited<ReturnType<typeof useGetEphemeralTokenQuery>>["data"];
};
