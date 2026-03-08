import { useState } from "react";
import { toast } from "sonner";
import { maxUint256, parseEventLogs } from "viem";
import { useConnection, usePublicClient } from "wagmi";
import { useEvmContext } from "@/src/lib/context/evm-context";
import { useCreCliTxHashStore } from "@/src/lib/store/use-cre-cli-tx-hash-store";
import { parseUSDC } from "@/src/lib/utils/usdc";
import { useCreateMeetingMutation } from "../api/use-meetings-api";
import {
	useCreateSessionMutation,
	useEnrollParticipantMutation,
	useUpdateSessionMutation,
} from "../api/use-sessions-api";
import { useUploadToPinataMutation } from "../api/use-uploads-api";

export interface ListingFormInput {
	goals: Array<{ name: string; weight: number }>;
	metadata: {
		description?: string;
		email: string;
		title: string;
	};
	/** Human-readable USDC amount (e.g. "1", "10.50") */
	price: string;
	topic: string;
}

interface RequestMeetingInput {
	attendees: string[];
	sessionId: number;
	summary: string;
}

const ensureContracts = (
	contracts: ReturnType<typeof useEvmContext>["contracts"]
) => {
	if (!(contracts?.Manager.address && contracts.USDC.address)) {
		throw new Error("Contracts are not ready");
	}
	return contracts;
};

export function useAddListing() {
	const { contracts } = useEvmContext();
	const upload = useUploadToPinataMutation();
	const publicClient = usePublicClient();
	const createSession = useCreateSessionMutation();
	const [isRunning, setIsRunning] = useState(false);

	const execute = (input: ListingFormInput) => {
		const kx = ensureContracts(contracts);
		setIsRunning(true);

		try {
			return toast.promise(
				(async () => {
					if (!(publicClient && contracts?.Manager.abi)) {
						throw new Error("Public client or Manager ABI is not available");
					}
					const priceRaw = parseUSDC(input.price);
					const uploadResponse = await upload.mutateAsync({
						json: {
							...input,
							metadata: JSON.stringify(input.metadata),
							price: Number(priceRaw),
						},
					});
					const txHash = await kx.Manager.write.createListing([
						uploadResponse.cid,
						priceRaw,
					]);

					console.log("txHash for createListing", txHash);

					const receipt = await publicClient.waitForTransactionReceipt({
						hash: txHash,
					});
					if (receipt.status !== "success") {
						throw new Error("Listing creation transaction failed");
					}

					const logs = parseEventLogs({
						abi: contracts.Manager.abi,
						logs: receipt.logs,
						eventName: "ListingUpsert",
					});
					const logData = logs[0]?.args;
					if (!logData) {
						throw new Error("Listing index not found in logs");
					}

					console.log("cid", logData.dataCID);

					return createSession.mutateAsync({
						logData: {
							index: Number(logData.index),
							dataCID: logData.dataCID,
						},
						metadata: input.metadata,
						topic: input.topic,
						price: Number(priceRaw),
						goals: input.goals,
					});
				})(),
				{
					loading: "Creating listing...",
					success: "Listing creation queued",
					error: (error) =>
						error instanceof Error ? error.message : "Create listing failed",
				}
			);
		} finally {
			setIsRunning(false);
		}
	};

	return {
		execute,
		isPending: isRunning,
	};
}

export function useUpdateListing() {
	const { contracts } = useEvmContext();
	const upload = useUploadToPinataMutation();
	const updateSession = useUpdateSessionMutation();
	const publicClient = usePublicClient();
	const [isRunning, setIsRunning] = useState(false);

	const execute = (sessionId: number, input: ListingFormInput) => {
		const kx = ensureContracts(contracts);
		setIsRunning(true);

		try {
			return toast.promise(
				(async () => {
					if (!(publicClient && contracts?.Manager.abi)) {
						throw new Error("Public client or Manager ABI is not available");
					}
					const priceRaw = parseUSDC(input.price);
					const uploadResponse = await upload.mutateAsync({
						json: {
							...input,
							metadata: JSON.stringify(input.metadata),
							price: Number(priceRaw),
						},
					});
					const txHash = await kx.Manager.write.updateListing([
						BigInt(sessionId),
						uploadResponse.cid,
						priceRaw,
					]);
					const receipt = await publicClient.waitForTransactionReceipt({
						hash: txHash,
					});
					if (receipt.status !== "success") {
						throw new Error("Listing update transaction failed");
					}
					const logs = parseEventLogs({
						abi: contracts.Manager.abi,
						logs: receipt.logs,
						eventName: "ListingUpsert",
					});
					const logData = logs[0]?.args;
					if (!logData) {
						throw new Error("Listing index not found in logs");
					}
					return updateSession.mutateAsync({
						sessionId,
						logData: {
							index: Number(logData.index),
							dataCID: logData.dataCID,
						},
						metadata: input.metadata,
						topic: input.topic,
						price: Number(priceRaw),
						goals: input.goals,
					});
				})(),
				{
					loading: "Updating listing...",
					success: "Listing update queued",
					error: (error) =>
						error instanceof Error ? error.message : "Update listing failed",
				}
			);
		} finally {
			setIsRunning(false);
		}
	};

	return {
		execute,
		isPending: isRunning,
	};
}

export function useRequestEvaluation() {
	const { contracts } = useEvmContext();
	const setEvaluationRequestTxHash = useCreCliTxHashStore(
		(state) => state.setEvaluationRequestTxHash
	);
	const [isRunning, setIsRunning] = useState(false);

	const execute = (meetingIndex: number) => {
		if (!contracts?.SessionRegistry.address) {
			throw new Error("Contracts are not ready");
		}
		setIsRunning(true);

		try {
			return toast.promise(
				(async () => {
					const txHash =
						await contracts.SessionRegistry.write.requestEvaluation([
							BigInt(meetingIndex),
						]);
					setEvaluationRequestTxHash(meetingIndex, txHash);
					return txHash;
				})(),
				{
					loading: "Requesting evaluation...",
					success: "Evaluation request queued",
					error: (error) =>
						error instanceof Error
							? error.message
							: "Request evaluation failed",
				}
			);
		} finally {
			setIsRunning(false);
		}
	};

	return {
		execute,
		isPending: isRunning,
	};
}

export function useRequestSessionRegistrationAndEnroll() {
	const { contracts, ready } = useEvmContext();
	const { address } = useConnection();
	const publicClient = usePublicClient();
	const setRequestSessionRegistrationTxHash = useCreCliTxHashStore(
		(state) => state.setRequestSessionRegistrationTxHash
	);
	const createMeeting = useCreateMeetingMutation();
	const enroll = useEnrollParticipantMutation();
	const [isRunning, setIsRunning] = useState(false);
	const isContractsReady = ready && Boolean(contracts);

	const execute = (input: RequestMeetingInput) => {
		if (!isContractsReady) {
			throw new Error("Contracts are not ready");
		}
		if (!address) {
			throw new Error("Wallet not connected");
		}
		if (!publicClient) {
			throw new Error("Public client is unavailable");
		}
		const kx = ensureContracts(contracts);
		setIsRunning(true);

		try {
			return toast.promise(
				(async () => {
					const meeting = await createMeeting.mutateAsync({
						sessionId: input.sessionId,
						summary: input.summary,
						attendees: input.attendees,
					});
					if (!(meeting.meetingUrl && meeting.sessionPrice)) {
						throw new Error("Failed to create meeting");
					}

					console.log("meeting", meeting.meetingUrl);

					const amount = BigInt(meeting.sessionPrice);
					const balance = await kx.USDC.read.balanceOf([address]);
					if (balance < amount) {
						throw new Error("Insufficient balance");
					}

					const allowance = await kx.USDC.read.allowance([
						address,
						kx.Manager.address,
					]);
					if (allowance < amount) {
						await kx.USDC.write.approve([kx.Manager.address, maxUint256]);
					}

					const txHash = await kx.Manager.write.requestSessionRegistration(
						[BigInt(input.sessionId), meeting.meetingUrl],
						{
							gas: 500_000n,
						}
					);
					setRequestSessionRegistrationTxHash(input.sessionId, txHash);

					console.log("txHash for requestSessionRegistration", txHash);
					const receipt = await publicClient.waitForTransactionReceipt({
						hash: txHash,
					});
					if (receipt.status !== "success") {
						throw new Error("Session registration transaction failed");
					}

					await enroll.mutateAsync({
						sessionId: input.sessionId,
						meetingUrl: meeting.meetingUrl,
						txHash,
					});

					return { meetingUrl: meeting.meetingUrl, txHash };
				})(),
				{
					loading: "Requesting session...",
					success: "Session request successful",
					error: (error) =>
						error instanceof Error ? error.message : "Session request failed",
				}
			);
		} finally {
			setIsRunning(false);
		}
	};

	return {
		execute,
		isPending: isRunning,
		isReady: isContractsReady,
	};
}
