import { parseEventLogs } from "viem";
import { usePublicClient, useWriteContract } from "wagmi";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import type { KXContracts } from "@/src/lib/context/evm-context";
import { useCreateSessionMutation } from "@/src/lib/hooks/api/use-sessions-api";
import { useUploadToPinataMutation } from "@/src/lib/hooks/api/use-uploads-api";
import { parseUSDC } from "@/src/lib/utils/usdc";

const listingData = {
	goals: [
		{ name: "Deploying a contract to a testnet", weight: 1 },
		{ name: "Understanding the contract's functionality", weight: 1 },
		{ name: "Understanding the contract's ABI", weight: 1 },
	],
	price: "1",
	topic: "Blockchain development",
	metadata: {
		title: "Ethereum smart contracts",
		description: "This is a test listing",
		email: "kartik100100@gmail.com",
	},
};

export function AddListing({ contracts }: { contracts: KXContracts }) {
	const writeContract = useWriteContract();
	const upload = useUploadToPinataMutation();
	const createSession = useCreateSessionMutation();
	const publicClient = usePublicClient();

	const isPending =
		upload.isPending || writeContract.isPending || createSession.isPending;

	async function handleAddListing() {
		if (
			!(contracts?.Manager.address && contracts?.Manager.abi && publicClient)
		) {
			return;
		}

		const priceRaw = parseUSDC(listingData.price);
		const uploadResponse = await upload.mutateAsync({
			json: {
				...listingData,
				metadata: JSON.stringify(listingData.metadata),
				price: Number(priceRaw),
			},
		});
		const cid = uploadResponse.cid;
		console.log("upload completed", cid);
		const txHash = await writeContract.mutateAsync({
			address: contracts.Manager.address,
			abi: contracts.Manager.abi,
			functionName: "createListing",
			args: [cid, priceRaw],
		});
		console.log("write contract completed", txHash);

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

		await createSession.mutateAsync({
			logData: {
				index: Number(logData.index),
				dataCID: logData.dataCID,
			},
			metadata: listingData.metadata,
			topic: listingData.topic,
			price: Number(priceRaw),
			goals: listingData.goals,
		});
	}

	return (
		<TestCard
			data={JSON.stringify(
				{
					txHash: writeContract.data,
					cid: upload.data?.cid,
				},
				null,
				2
			)}
			description="Add a listing"
			title="Add Listing"
		>
			<Button
				className="w-full"
				disabled={isPending}
				onClick={handleAddListing}
			>
				{isPending ? "Adding..." : "Add Listing"}
			</Button>
		</TestCard>
	);
}
