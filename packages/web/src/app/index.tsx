import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ThemeSwitch from "../components/custom/theme-switch";
import { Button } from "../components/ui/button";
import { useAuth } from "../lib/context/auth-context";
import { useContracts } from "../lib/hooks/web3/use-contracts";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { authenticated, login, logout } = useAuth();
	const navigate = useNavigate();

	const { contracts } = useContracts();
	console.log("contracts", contracts);

	return (
		<div className="flex h-screen flex-col items-center justify-center p-8">
			<h1 className="text-7xl uppercase lg:text-9xl">Verity</h1>
			<p className="mt-2 font-light text-2xl text-muted-foreground">
				Verifiable Proof of Value for the expert economy.
			</p>

			<div className="flex gap-2">
				<Button
					className="mt-4"
					onClick={() =>
						authenticated ? navigate({ to: "/dashboard" }) : login.mutate()
					}
				>
					{authenticated ? "Dashboard" : "Login"}
				</Button>

				<Button
					className="mt-4"
					disabled={!authenticated}
					onClick={() => logout()}
				>
					Logout
				</Button>
			</div>

			<ThemeSwitch
				className="absolute right-4 bottom-4"
				variant={"secondary"}
			/>
		</div>
	);
}
