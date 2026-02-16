import { usePrivy } from "@privy-io/react-auth";
import { createFileRoute } from "@tanstack/react-router";
import { hardhat, mainnet, sepolia } from "viem/chains";
import { Loader } from "@/src/components/custom/loading";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/src/components/ui/select";
import { useSwitchNetwork } from "@/src/lib/hooks/wallets/use-switch-chain";
import { useSwitchWallet } from "@/src/lib/hooks/wallets/use-switch-wallet";
import { truncateAddress } from "@/src/lib/utils";

export const Route = createFileRoute("/auth/")({
	component: AuthPage,
});

function AuthPage() {
	const privy = usePrivy();
	const { wallets, activeWallet, switchWallet } = useSwitchWallet();
	const { switchChain, isSwitching } = useSwitchNetwork();
	const chains = [hardhat, mainnet, sepolia];

	if (!privy.ready) return <Loader />;
	return (
		<div className="flex flex-col items-center min-h-screen p-8">
			<h1 className="mb-8 text-center">Auth</h1>

			<TestCard
				title="Login"
				description="Login with Privy"
				children={<Button onClick={() => privy.login()}>Login</Button>}
				data={privy.user ? JSON.stringify(privy.user, null, 2) : null}
			/>

			<TestCard
				title="Logout"
				description="Logout with Privy"
				children={<Button onClick={() => privy.logout()}>Logout</Button>}
				data={privy.authenticated ? "Logged in" : "Logged out"}
			/>

			<TestCard
				title="Switch Wallet"
				description="Switch Wallet with Privy"
				children={
					<form
						onSubmit={(e) => {
							e.preventDefault();
							const formData = new FormData(e.target as HTMLFormElement);
							const walletAddress = formData.get("walletAddress") as string;
							switchWallet(walletAddress);
						}}
						className="flex gap-2 w-full"
					>
						<Select>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a wallet" />
							</SelectTrigger>
							<SelectContent position="popper">
								{wallets.map((wallet) => (
									<SelectItem key={wallet.address} value={wallet.address}>
										{truncateAddress(wallet.address)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button type="submit">Switch</Button>
					</form>
				}
				data={activeWallet}
			/>

			<TestCard
				title="Switch Chain"
				description="Switch Chain with Privy"
				children={
					<form
						onSubmit={(e) => {
							e.preventDefault();
							const formData = new FormData(e.target as HTMLFormElement);
							const walletAddress = formData.get("walletAddress") as string;
							const selectedChainId = formData.get("selectedChain") as string;
							switchChain(walletAddress, Number(selectedChainId));
						}}
						className="flex gap-2 w-full"
					>
						<Select>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a chain" />
							</SelectTrigger>
							<SelectContent position="popper">
								{chains.map((chain) => (
									<SelectItem key={chain.id} value={chain.id.toString()}>
										{chain.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button type="submit" disabled={isSwitching}>
							{isSwitching ? "Switching..." : "Switch"}
						</Button>
					</form>
				}
				data={activeWallet}
			/>
		</div>
	);
}
