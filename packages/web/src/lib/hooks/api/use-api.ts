import type {
	CreateEventInput,
	GetBotInput,
	GetEphemeralTokenInput,
	GetTranscriptInput,
} from "./use-meet-api";
import {
	useCreateEventMutation,
	useGetBotQuery,
	useGetEphemeralTokenQuery,
	useGetTranscriptQuery,
} from "./use-meet-api";
import {
	type GetUserInput,
	type RegisterUserInput,
	useGetUserQuery,
	useRegisterUserMutation,
} from "./use-user-api";

export function useApi() {
	return {
		meet: {
			createEvent: useCreateEventMutation,
			getBot: useGetBotQuery,
			getTranscript: useGetTranscriptQuery,
			getToken: useGetEphemeralTokenQuery,
			registerUser: useRegisterUserMutation,
		},
		users: {
			getUser: useGetUserQuery,
			registerUser: useRegisterUserMutation,
		},
	};
}

export type ApiRequestTypes = {
	createEvent: CreateEventInput;
	getBot: GetBotInput;
	getTranscript: GetTranscriptInput;
	getToken: GetEphemeralTokenInput;
	registerUser: RegisterUserInput;
	getUser: GetUserInput;
};

export type ApiResponseTypes = {
	createEvent: Awaited<ReturnType<typeof useCreateEventMutation>>["data"];
	getBot: Awaited<ReturnType<typeof useGetBotQuery>>["data"];
	getTranscript: Awaited<ReturnType<typeof useGetTranscriptQuery>>["data"];
	getToken: Awaited<ReturnType<typeof useGetEphemeralTokenQuery>>["data"];
	registerUser: Awaited<ReturnType<typeof useRegisterUserMutation>>["data"];
	getUser: Awaited<ReturnType<typeof useGetUserQuery>>["data"];
};
