import type {
	CreateBotInput,
	CreateEventInput,
	GetBotInput,
	GetEphemeralTokenInput,
	GetTranscriptInput,
} from "./use-meet-api";
import {
	useCreateBotMutation,
	useCreateEventMutation,
	useGetBotQuery,
	useGetEphemeralTokenQuery,
	useGetTranscriptQuery,
} from "./use-meet-api";

export function useApi() {
	return {
		createEvent: useCreateEventMutation(),
		createBot: useCreateBotMutation(),
		getBot: useGetBotQuery,
		getTranscript: useGetTranscriptQuery,
		getToken: useGetEphemeralTokenQuery,
	};
}

export type ApiRequestTypes = {
	createEvent: CreateEventInput;
	createBot: CreateBotInput;
	getBot: GetBotInput;
	getTranscript: GetTranscriptInput;
	getToken: GetEphemeralTokenInput;
};

export type ApiResponseTypes = {
	createEvent: Awaited<ReturnType<typeof useCreateEventMutation>>["data"];
	createBot: Awaited<ReturnType<typeof useCreateBotMutation>>["data"];
	getBot: Awaited<ReturnType<typeof useGetBotQuery>>["data"];
	getTranscript: Awaited<ReturnType<typeof useGetTranscriptQuery>>["data"];
	getToken: Awaited<ReturnType<typeof useGetEphemeralTokenQuery>>["data"];
};
