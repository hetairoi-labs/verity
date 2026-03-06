import { useWriteContract } from "wagmi";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useEvmContext } from "@/src/lib/context/evm-context";
import { useUpdateSessionMutation } from "@/src/lib/hooks/api/use-sessions-api";
import { useUploadToPinataMutation } from "@/src/lib/hooks/api/use-uploads-api";

const listingData = {
	index: 13,
	goals: [
		{ name: "Updated: Deploying a contract to a testnet", weight: 1 },
		{ name: "Updated: Understanding the contract's functionality", weight: 1 },
		{ name: "Updated: Understanding the contract's ABI", weight: 1 },
	],
	price: 1_000_000_000,
	topic: "Updated: Blockchain development",
	metadata: {
		title: "Updated: Ethereum smart contracts",
		description: "This is a updated test listing",
	},
};

export function UpdateListing() {
	const { contracts } = useEvmContext();
	const writeContract = useWriteContract();
	const upload = useUploadToPinataMutation();
	const updateSession = useUpdateSessionMutation();

	const isPending =
		upload.isPending || writeContract.isPending || updateSession.isPending;

	async function handleUpdateListing() {
		if (!(contracts?.Manager.address && contracts?.Manager.abi)) {
			return;
		}

		const uploadResponse = await upload.mutateAsync({
			json: {
				...listingData,
				metadata: JSON.stringify(listingData.metadata),
			},
		});
		const cid = uploadResponse.cid;
		console.log("upload completed", cid);

		const txHash = await writeContract.mutateAsync({
			address: contracts.Manager.address,
			abi: contracts.Manager.abi,
			functionName: "updateListing",
			args: [BigInt(listingData.index), cid, BigInt(listingData.price)],
		});
		console.log("write contract completed", txHash);

		const updateSessionResponse = await updateSession.mutateAsync({
			txHash,
			metadata: JSON.stringify(listingData.metadata),
			topic: listingData.topic,
			price: listingData.price,
			goals: listingData.goals,
		});
		console.log("updateSession completed", updateSessionResponse);
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
			<Button
				className="w-full"
				disabled={isPending}
				onClick={handleUpdateListing}
			>
				{isPending ? "Updating..." : "Update Listing"}
			</Button>
		</TestCard>
	);
}
