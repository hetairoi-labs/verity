import { useState } from "react";
import { useWriteContract } from "wagmi";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import type { KXContracts } from "@/src/lib/context/evm-context";
import { useUpdateSessionMutation } from "@/src/lib/hooks/api/use-sessions-api";
import { useUploadToPinataMutation } from "@/src/lib/hooks/api/use-uploads-api";
import { parseUSDC } from "@/src/lib/utils/usdc";

const listingData = {
	goals: [
		{ name: "Updated: Deploying a contract to a testnet", weight: 1 },
		{ name: "Updated: Understanding the contract's functionality", weight: 1 },
		{ name: "Updated: Understanding the contract's ABI", weight: 1 },
	],
	price: "1000",
	topic: "Updated: Blockchain development",
	metadata: {
		title: "Updated: Ethereum smart contracts",
		description: "This is a updated test listing",
		email: "kartik100100@gmail.com",
	},
};

export function UpdateListing({ contracts }: { contracts: KXContracts }) {
	const writeContract = useWriteContract();
	const upload = useUploadToPinataMutation();
	const updateSession = useUpdateSessionMutation();
	const [index, setIndex] = useState<number | undefined>(undefined);

	const isPending =
		upload.isPending || writeContract.isPending || updateSession.isPending;

	async function handleUpdateListing() {
		if (!(contracts?.Manager.address && contracts?.Manager.abi && index)) {
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
			functionName: "updateListing",
			args: [BigInt(index), cid, priceRaw],
		});
		console.log("write contract completed", txHash);

		await updateSession.mutateAsync({
			sessionId: index,
			txHash,
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
			description="Update a listing"
			title="Update Listing"
		>
			<Input
				onChange={(e) => setIndex(Number(e.target.value))}
				placeholder="Session Id"
			/>
			<Button
				className="w-full"
				disabled={isPending || !index}
				onClick={handleUpdateListing}
			>
				{isPending ? "Updating..." : "Update Listing"}
			</Button>
		</TestCard>
	);
}
