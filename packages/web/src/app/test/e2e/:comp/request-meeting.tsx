import { useState } from "react";
import { maxUint256 } from "viem";
import { useConnection, useWriteContract } from "wagmi";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useEvmContext } from "@/src/lib/context/evm-context";
import { useCreateMeetingMutation } from "@/src/lib/hooks/api/use-meetings-api";

const SAMPLE_MEETING_DATA = {
	summary: "Kex Session",
	attendees: ["ishtails@gmail.com"],
};

export function RequestMeeting() {
	const [index, setIndex] = useState<number | undefined>(undefined);
	const { contracts } = useEvmContext();
	const connection = useConnection();
	const writeContract = useWriteContract();
	const createMeeting = useCreateMeetingMutation();
	const isPending = writeContract.isPending || createMeeting.isPending;

	console.log("connection", connection.address);

	async function handleSubmit() {
		if (
			!(
				contracts?.Manager.address &&
				contracts?.Manager.abi &&
				index &&
				connection.address
			)
		) {
			return;
		}

		const meetingResponse = await createMeeting.mutateAsync({
			sessionId: index,
			summary: SAMPLE_MEETING_DATA.summary,
			attendees: SAMPLE_MEETING_DATA.attendees,
		});
		const meetingUrl = meetingResponse?.meetingUrl;
		const sessionPrice = meetingResponse?.sessionPrice;
		if (!(meetingUrl && sessionPrice)) {
			return;
		}
		console.log("create meeting completed", meetingUrl);

		// Get listing price from contracts in prod.
		const amount = BigInt(sessionPrice);

		const allowance = await contracts.USDC.read.allowance([
			connection.address,
			contracts.USDC.address,
		]);

		// approve USDC
		if (allowance < amount) {
			const approveTxHash = await writeContract.mutateAsync({
				address: contracts.USDC.address,
				abi: contracts.USDC.abi,
				functionName: "approve",
				args: [contracts.Manager.address, maxUint256],
			});
			console.log("approve USDC completed", approveTxHash);
		}

		// request session registration
		const txHash = await writeContract.mutateAsync({
			address: contracts.Manager.address,
			abi: contracts.Manager.abi,
			functionName: "requestSessionRegistration",
			args: [amount, meetingUrl, BigInt(index)],
			gas: 500_000n,
		});
		console.log("write contract completed", txHash);
	}

	return (
		<TestCard
			data={JSON.stringify(
				{
					txHash: writeContract.data,
				},
				null,
				2
			)}
			description="Request a meeting"
			title="Request Meeting"
		>
			<Input
				onChange={(e) => setIndex(Number(e.target.value))}
				placeholder="Session Id"
			/>
			<Button
				className="w-full"
				disabled={isPending || !index}
				onClick={handleSubmit}
			>
				{isPending ? "Requesting..." : "Request Meeting"}
			</Button>
		</TestCard>
	);
}
