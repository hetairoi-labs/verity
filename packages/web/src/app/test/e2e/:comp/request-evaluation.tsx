import { useState } from "react";
import { useWriteContract } from "wagmi";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import type { KXContracts } from "@/src/lib/context/evm-context";

export function RequestEvaluation({ contracts }: { contracts: KXContracts }) {
	const writeContract = useWriteContract();
	const [sessionId, setSessionId] = useState<number | undefined>(undefined);

	async function handleRequestEvaluation() {
		if (
			!(
				contracts?.SessionRegistry.address &&
				contracts?.SessionRegistry.abi &&
				sessionId !== undefined
			)
		) {
			return;
		}

		const txHash = await writeContract.mutateAsync({
			address: contracts.SessionRegistry.address,
			abi: contracts.SessionRegistry.abi,
			functionName: "requestEvaluation",
			args: [BigInt(sessionId)],
			gas: 500_000n,
		});
		console.log("requestEvaluation completed", txHash);
	}

	return (
		<TestCard
			data={JSON.stringify(
				{
					txHash: writeContract.data,
					sessionId,
				},
				null,
				2
			)}
			description="Request AI evaluation for a funded session"
			title="Request Evaluation"
		>
			<Input
				onChange={(event) => setSessionId(Number(event.target.value))}
				placeholder="Session Id"
			/>
			<Button
				className="w-full"
				disabled={writeContract.isPending || sessionId === undefined}
				onClick={handleRequestEvaluation}
			>
				{writeContract.isPending ? "Requesting..." : "Request Evaluation"}
			</Button>
		</TestCard>
	);
}
