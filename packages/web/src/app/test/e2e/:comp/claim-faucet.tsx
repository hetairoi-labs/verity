import { useConnection } from "wagmi";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useEvmContext } from "@/src/lib/context/evm-context";
import { useFaucetMutation } from "@/src/lib/hooks/api/use-evm-api";

export function ClaimFaucet() {
	const { contracts } = useEvmContext();
	const { address } = useConnection();
	const faucet = useFaucetMutation();

	async function handleClaimFaucet() {
		if (!address) {
			return;
		}
		const balance = await contracts?.USDC.read.balanceOf([address]);
		console.log("balance", balance, address);

		if (balance === undefined) {
			return;
		}

		if (balance < 1_000_000n) {
			faucet.mutate({
				address,
			});
		}
	}

	return (
		<TestCard
			data={JSON.stringify(faucet.data, null, 2)}
			description="Claim USDC"
			title="Claim USDC"
		>
			<Button
				className="w-full"
				disabled={faucet.isPending}
				onClick={handleClaimFaucet}
			>
				{faucet.isPending ? "Claiming..." : "Claim USDC"}
			</Button>
		</TestCard>
	);
}
