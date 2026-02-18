import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "@/src/components/custom/loading";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useActiveWallet } from "@/src/lib/hooks/web3/use-active-wallet";
import { useAuth } from "@/src/lib/hooks/web3/use-auth";

export const Route = createFileRoute("/auth/")({
	component: AuthPage,
});

function AuthPage() {
	const { isWalletOnDefaultChain, switchNetwork, defaultChain } =
		useActiveWallet();
	const { state, login, logout } = useAuth();

	if (state.ready) return <Loader />;
	return (
		<div className="flex flex-col items-center min-h-screen p-8">
			<h1 className="mb-8 text-center">Auth</h1>

			<TestCard
				title="Login"
				description="Login with Privy"
				children={<Button onClick={() => login.mutate()}>Login</Button>}
				data={state.user ? JSON.stringify(state.user, null, 2) : null}
			/>

			<TestCard
				title="Switch Network"
				description="Switch to default network"
				children={
					<Button
						onClick={() => switchNetwork(defaultChain.id)}
						disabled={isWalletOnDefaultChain}
					>
						Switch Network
					</Button>
				}
				data={
					isWalletOnDefaultChain
						? "On default network"
						: "Not on default network"
				}
			/>

			<TestCard
				title="Logout"
				description="Logout with Privy"
				children={<Button onClick={() => logout()}>Logout</Button>}
				data={state.authenticated ? "Logged in" : "Not logged in"}
			/>
		</div>
	);
}
