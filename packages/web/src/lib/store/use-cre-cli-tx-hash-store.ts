import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CreCliTxHashStore {
	evaluationRequestMeetingIndex?: number;
	evaluationRequestTxHash?: string;
	requestSessionRegistrationSessionId?: number;
	requestSessionRegistrationTxHash?: string;
	resetTxHashes: () => void;
	setEvaluationRequestTxHash: (meetingIndex: number, txHash: string) => void;
	setRequestSessionRegistrationTxHash: (
		sessionId: number,
		txHash: string
	) => void;
}

export const useCreCliTxHashStore = create<CreCliTxHashStore>()(
	persist(
		(set) => ({
			evaluationRequestMeetingIndex: undefined,
			evaluationRequestTxHash: undefined,
			requestSessionRegistrationSessionId: undefined,
			requestSessionRegistrationTxHash: undefined,
			setEvaluationRequestTxHash: (meetingIndex: number, txHash: string) =>
				set({
					evaluationRequestMeetingIndex: meetingIndex,
					evaluationRequestTxHash: txHash,
				}),
			setRequestSessionRegistrationTxHash: (
				sessionId: number,
				txHash: string
			) =>
				set({
					requestSessionRegistrationSessionId: sessionId,
					requestSessionRegistrationTxHash: txHash,
				}),
			resetTxHashes: () =>
				set({
					evaluationRequestMeetingIndex: undefined,
					evaluationRequestTxHash: undefined,
					requestSessionRegistrationSessionId: undefined,
					requestSessionRegistrationTxHash: undefined,
				}),
		}),
		{
			name: "cre-cli-tx-hashes",
		}
	)
);
