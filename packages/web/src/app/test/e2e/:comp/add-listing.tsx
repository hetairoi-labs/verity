import { useWriteContract } from "wagmi";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useEvmContext } from "@/src/lib/context/evm-context";
import { useCreateSessionMutation } from "@/src/lib/hooks/api/use-sessions-api";
import { useUploadToPinataMutation } from "@/src/lib/hooks/api/use-uploads-api";

const listingData = {
	goals: [
		{ name: "Deploying a contract to a testnet", weight: 1 },
		{ name: "Understanding the contract's functionality", weight: 1 },
		{ name: "Understanding the contract's ABI", weight: 1 },
	],
	price: 1_000_000,
	topic: "Blockchain development",
	metadata: {
		title: "Ethereum smart contracts",
		description: "This is a test listing",
	},
};

export function AddListing() {
	const { contracts } = useEvmContext();
	const writeContract = useWriteContract();
	const upload = useUploadToPinataMutation();
	const createSession = useCreateSessionMutation();

	const isPending =
		upload.isPending || writeContract.isPending || createSession.isPending;

	async function handleAddListing() {
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
			functionName: "createListing",
			args: [cid, 1_000_000n],
		});
		console.log("write contract completed", txHash);

		const createSessionResponse = await createSession.mutateAsync({
			txHash,
			metadata: JSON.stringify(listingData.metadata),
			topic: listingData.topic,
			price: listingData.price,
			goals: listingData.goals,
		});
		console.log("createSession completed", createSessionResponse);
	}

	return (
		<TestCard
			data={JSON.stringify({
				txHash: writeContract.data,
				cid: upload.data?.cid,
			})}
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
