import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "@/src/components/custom/loading";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/lib/context/auth-context";
import { useGetUserQuery } from "@/src/lib/hooks/api/use-user-api";
import { useActiveWallet } from "@/src/lib/hooks/web3/use-active-wallet";

export const Route = createFileRoute("/test/auth/")({
	component: AuthPage,
});

function AuthPage() {
	const { data: user } = useGetUserQuery();
	const { state, login, logout } = useAuth();
	const { isWalletOnDefaultChain, switchNetwork, defaultChain } =
		useActiveWallet();

	if (!state.ready) {
		return <Loader />;
	}
	return (
		<div className="flex min-h-screen flex-col items-center p-8">
			<h1 className="mb-8 text-center">Auth</h1>
			<TestCard
				data={user ? JSON.stringify(user, null, 2) : "Not logged in"}
				description="Coming from API"
				title="User Details"
			/>

			<TestCard
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
				description="Login / Logout"
				title="Authentication"
			/>

			<TestCard
				children={
					<Button
						disabled={isWalletOnDefaultChain}
						onClick={() => switchNetwork(defaultChain.id)}
					>
						Switch Network
					</Button>
				}
				data={
					isWalletOnDefaultChain
						? "On default network"
						: "Not on default network"
				}
				description="Switch to default network"
				title="Switch Network"
			/>
		</div>
	);
}
