import { usePrivy } from "@privy-io/react-auth";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader } from "@/src/components/custom/loading";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { useActiveWallet } from "@/src/lib/hooks/wallet/use-active-wallet";

export const Route = createFileRoute("/auth/")({
	component: AuthPage,
});

function AuthPage() {
	const { isWalletOnDefaultChain, switchNetwork, defaultChain } =
		useActiveWallet();

	useEffect(() => {
		if (!isWalletOnDefaultChain) {
			switchNetwork(defaultChain.id);
		}
	}, [isWalletOnDefaultChain, switchNetwork, defaultChain]);

	const privy = usePrivy();

	useEffect(() => {
		if (privy.authenticated) {
			privy.getAccessToken().then((token) => {
				console.log(token);
			});
		}
	}, [privy.authenticated, privy.getAccessToken]);

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
		</div>
	);
}
