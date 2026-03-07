import { useState } from "react";
import { toast } from "sonner";
import { maxUint256 } from "viem";
import { useAccount, usePublicClient } from "wagmi";
import { useEvmContext } from "@/src/lib/context/evm-context";
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
	price: number;
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
	const createSession = useCreateSessionMutation();
	const [isRunning, setIsRunning] = useState(false);

	const execute = async (input: ListingFormInput) => {
		const kx = ensureContracts(contracts);
		setIsRunning(true);

		try {
			return await toast.promise(
				(async () => {
					const uploadResponse = await upload.mutateAsync({
						json: {
							...input,
							metadata: JSON.stringify(input.metadata),
						},
					});
					const txHash = await kx.Manager.write.createListing([
						uploadResponse.cid,
						BigInt(input.price),
					]);
					return createSession.mutateAsync({
						txHash,
						metadata: input.metadata,
						topic: input.topic,
						price: input.price,
						goals: input.goals,
					});
				})(),
				{
					loading: "Creating listing...",
					success: "Listing created",
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
	const [isRunning, setIsRunning] = useState(false);

	const execute = async (sessionId: number, input: ListingFormInput) => {
		const kx = ensureContracts(contracts);
		setIsRunning(true);

		try {
			return await toast.promise(
				(async () => {
					const uploadResponse = await upload.mutateAsync({
						json: {
							...input,
							metadata: JSON.stringify(input.metadata),
						},
					});
					const txHash = await kx.Manager.write.updateListing([
						BigInt(sessionId),
						uploadResponse.cid,
						BigInt(input.price),
					]);
					return updateSession.mutateAsync({
						sessionId,
						txHash,
						metadata: input.metadata,
						topic: input.topic,
						price: input.price,
						goals: input.goals,
					});
				})(),
				{
					loading: "Updating listing...",
					success: "Listing updated",
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
	const [isRunning, setIsRunning] = useState(false);

	const execute = async (sessionId: number) => {
		if (!contracts?.SessionRegistry.address) {
			throw new Error("Contracts are not ready");
		}
		setIsRunning(true);

		try {
			return await toast.promise(
				contracts.SessionRegistry.write.requestEvaluation([BigInt(sessionId)]),
				{
					loading: "Requesting evaluation...",
					success: "Evaluation requested",
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
	const { contracts } = useEvmContext();
	const { address } = useAccount();
	const publicClient = usePublicClient();
	const createMeeting = useCreateMeetingMutation();
	const enroll = useEnrollParticipantMutation();
	const [isRunning, setIsRunning] = useState(false);

	const execute = async (input: RequestMeetingInput) => {
		const kx = ensureContracts(contracts);
		if (!address) {
			throw new Error("Wallet not connected");
		}
		if (!publicClient) {
			throw new Error("Public client is unavailable");
		}
		setIsRunning(true);

		try {
			return await toast.promise(
				(async () => {
					const meeting = await createMeeting.mutateAsync({
						sessionId: input.sessionId,
						summary: input.summary,
						attendees: input.attendees,
					});
					if (!(meeting.meetingUrl && meeting.sessionPrice)) {
						throw new Error("Failed to create meeting");
					}

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

					const txHash = await kx.Manager.write.requestSessionRegistration([
						BigInt(input.sessionId),
						meeting.meetingUrl,
					]);
					const receipt = await publicClient.waitForTransactionReceipt({
						hash: txHash,
					});
					if (receipt.status !== "success") {
						throw new Error("Session registration transaction failed");
					}

					await enroll.mutateAsync({
						sessionId: input.sessionId,
						txHash,
					});

					return { meetingUrl: meeting.meetingUrl, txHash };
				})(),
				{
					loading: "Requesting session...",
					success: "Session requested and enrolled",
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
	};
}
