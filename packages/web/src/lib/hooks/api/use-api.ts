import client from "../../utils/api-client";
import { useApiMutation } from "./use-api-mutation";

type MeetResponse = { event: { hangoutLink?: string } };
type BotResponse = { bot: unknown };

export function useApi() {
	return {
		meet: useApiMutation<MeetResponse, { summary: string }>(
			(json: { summary: string }) =>
				client.meet["create-meeting"].$post({ json }),
			"meet",
		),

		createBot: useApiMutation<BotResponse, { meetingUrl: string }>(
			(json: { meetingUrl: string }) =>
				client.meet["create-bot"].$post({ json }),
			"createBot",
		),
	};
}
