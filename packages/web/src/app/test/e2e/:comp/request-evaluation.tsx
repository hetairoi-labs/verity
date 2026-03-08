import { useState } from "react";
import { createPublicClient, http, parseEventLogs } from "viem";
import { sepolia } from "viem/chains";
import { useWriteContract } from "wagmi";
import { safeAsync } from "@/lib/utils/safe";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import type { KXContracts } from "@/src/lib/context/evm-context";

export const publicClient = createPublicClient({
	chain: sepolia,
	transport: http(),
});

export function RequestEvaluation({ contracts }: { contracts: KXContracts }) {
	const writeContract = useWriteContract();
	const [sessionId, setSessionId] = useState<number | undefined>(undefined);

	async function handleRequestEvaluation() {
		console.log("requesting evaluation for session", sessionId);
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

		console.log("txHash", txHash);

		const [receipt, _] = await safeAsync(
			publicClient.waitForTransactionReceipt({
				hash: txHash,
			})
		);

		if (!receipt) {
			throw new Error("Failed to get transaction receipt");
		}

		console.log("receipt", receipt);

		const logs = parseEventLogs({
			abi: contracts.SessionRegistry.abi,
			logs: receipt.logs,
			eventName: "EvaluationRequested",
		});

		console.log("logs", logs);
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
