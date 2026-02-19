import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "@/src/components/custom/loading";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useApi } from "@/src/lib/hooks/api/use-api";
import { useActiveWallet } from "@/src/lib/hooks/web3/use-active-wallet";
import { useAuth } from "@/src/lib/hooks/web3/use-auth";

export const Route = createFileRoute("/auth/")({
	component: AuthPage,
});

function AuthPage() {
	const api = useApi();
	const { data: user } = api.users.getUser();
	const { state, login, logout } = useAuth();
	const { isWalletOnDefaultChain, switchNetwork, defaultChain } =
		useActiveWallet();

	if (!state.ready) return <Loader />;
	return (
		<div className="flex flex-col items-center min-h-screen p-8">
			<h1 className="mb-8 text-center">Auth</h1>
			<TestCard
				title="User Details"
				description="Coming from API"
				data={user ? JSON.stringify(user, null, 2) : "Not logged in"}
			/>

			<TestCard
				title="Authentication"
				description="Login / Logout"
				children={
					<div className="flex gap-2">
						<Button
							onClick={() => {
								login.mutate();
							}}
						>
							Login
						</Button>
						<Button onClick={() => logout()}>Logout</Button>
					</div>
				}
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
		</div>
	);
}
