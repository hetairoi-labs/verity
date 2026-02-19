import {
	type GetEphemeralTokenInput,
	useGetEphemeralTokenQuery,
} from "./use-gemini-api";
import type {
	CreateEventInput,
	GetBotInput,
	GetTranscriptInput,
} from "./use-meet-api";
import {
	useCreateEventMutation,
	useGetBotQuery,
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
		},
		users: {
			getUser: useGetUserQuery,
			registerUser: useRegisterUserMutation,
		},
		gemini: {
			getToken: useGetEphemeralTokenQuery,
		},
	};
}

export type ApiRequestTypes = {
	meet: {
		createEvent: CreateEventInput;
		getBot: GetBotInput;
		getTranscript: GetTranscriptInput;
	};
	users: {
		registerUser: RegisterUserInput;
		getUser: GetUserInput;
	};
	gemini: {
		getToken: GetEphemeralTokenInput;
	};
};

export type ApiResponseTypes = {
	meet: {
		createEvent: Awaited<ReturnType<typeof useCreateEventMutation>>["data"];
		getBot: Awaited<ReturnType<typeof useGetBotQuery>>["data"];
		getTranscript: Awaited<ReturnType<typeof useGetTranscriptQuery>>["data"];
	};
	users: {
		registerUser: Awaited<ReturnType<typeof useRegisterUserMutation>>["data"];
		getUser: Awaited<ReturnType<typeof useGetUserQuery>>["data"];
	};
	gemini: {
		getToken: Awaited<ReturnType<typeof useGetEphemeralTokenQuery>>["data"];
	};
};
