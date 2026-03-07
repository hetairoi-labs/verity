import { useState } from "react";
import { maxUint256 } from "viem";
import { useConnection } from "wagmi";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useEvmContext } from "@/src/lib/context/evm-context";
import { useCreateMeetingMutation } from "@/src/lib/hooks/api/use-meetings-api";
import { useGetSessionByIdQuery } from "@/src/lib/hooks/api/use-sessions-api";

const SAMPLE_MEETING_DATA = {
	summary: "Verity Session",
	attendees: ["ishtails@gmail.com"],
};

export function RequestMeeting() {
	const [index, setIndex] = useState<number | undefined>(undefined);
	const { contracts } = useEvmContext();
	const connection = useConnection();
	const createMeeting = useCreateMeetingMutation();
	const { data: session } = useGetSessionByIdQuery({
		sessionId: index ? [String(index)] : "0",
	});
	const isPending = createMeeting.isPending;

	async function handleSubmit() {
		if (
			!(
				contracts?.Manager.address &&
				contracts?.Manager.abi &&
				connection.address &&
				session
			)
		) {
			return;
		}

		console.log("session", session);

		const balance = await contracts?.USDC.read.balanceOf([connection.address]);
		if (balance < BigInt(session.price)) {
			throw new Error("Insufficient balance");
		}

		const meetingResponse = await createMeeting.mutateAsync({
			sessionId: index ?? 0,
			summary: SAMPLE_MEETING_DATA.summary,
			attendees: SAMPLE_MEETING_DATA.attendees,
		});
		const meetingUrl = meetingResponse?.meetingUrl;
		const sessionPrice = meetingResponse?.sessionPrice;
		if (!(meetingUrl && sessionPrice)) {
			throw new Error("Failed to create meeting");
		}
		console.log("create meeting completed", meetingUrl);

		// Get listing price from contracts in prod.
		const amount = BigInt(sessionPrice);

		const allowance = await contracts.USDC.read.allowance([
			connection.address,
			contracts.Manager.address,
		]);

		console.log("allowance", {
			address: connection.address,
			toBeApproved: contracts.USDC.address,
			allowance,
		});

		// approve USDC
		if (allowance < amount) {
			const approveTxHash = await contracts.USDC.write.approve([
				contracts.Manager.address,
				maxUint256,
			]);
			console.log("approve USDC completed", approveTxHash);
		}

		// request session registration
		const txHash = await contracts.Manager.write.requestSessionRegistration(
			[BigInt(index ?? 0), meetingUrl],
			{
				gas: 500_000n,
			}
		);
		console.log("write contract completed", txHash);
	}

	return (
		<TestCard
			data={JSON.stringify(
				{
					txHash: createMeeting.data,
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
			<Button className="w-full" disabled={isPending} onClick={handleSubmit}>
				{isPending ? "Requesting..." : "Request Meeting"}
			</Button>
		</TestCard>
	);
}
