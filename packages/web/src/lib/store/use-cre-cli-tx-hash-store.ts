import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CreCliTxHashStore {
	evaluationRequestMeetingUrl?: string;
	evaluationRequestTxHash?: string;
	requestSessionRegistrationMeetingUrl?: string;
	requestSessionRegistrationTxHash?: string;
	resetTxHashes: () => void;
	setEvaluationRequestTxHash: (meetingUrl: string, txHash: string) => void;
	setRequestSessionRegistrationTxHash: (
		meetingUrl: string,
		txHash: string
	) => void;
}

export const useCreCliTxHashStore = create<CreCliTxHashStore>()(
	persist(
		(set) => ({
			evaluationRequestMeetingUrl: undefined,
			evaluationRequestTxHash: undefined,
			requestSessionRegistrationMeetingUrl: undefined,
			requestSessionRegistrationTxHash: undefined,
			setEvaluationRequestTxHash: (meetingUrl: string, txHash: string) =>
				set({
					evaluationRequestMeetingUrl: meetingUrl,
					evaluationRequestTxHash: txHash,
				}),
			setRequestSessionRegistrationTxHash: (
				meetingUrl: string,
				txHash: string
			) =>
				set({
					requestSessionRegistrationMeetingUrl: meetingUrl,
					requestSessionRegistrationTxHash: txHash,
				}),
			resetTxHashes: () =>
				set({
					evaluationRequestMeetingUrl: undefined,
					evaluationRequestTxHash: undefined,
					requestSessionRegistrationMeetingUrl: undefined,
					requestSessionRegistrationTxHash: undefined,
				}),
		}),
		{
			name: "cre-cli-tx-hashes",
		}
	)
);
