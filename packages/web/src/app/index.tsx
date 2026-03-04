import { createFileRoute, useNavigate } from "@tanstack/react-router";
import ThemeSwitch from "../components/custom/theme-switch";
import { Button } from "../components/ui/button";
import { useAuth } from "../lib/context/auth-context";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { state, login } = useAuth();
	const navigate = useNavigate();
	return (
		<div className="flex flex-col items-center justify-center h-screen p-8">
			<h1 className="text-7xl lg:text-9xl uppercase">Verity</h1>
			<p className="text-2xl text-muted-foreground font-light mt-2">
				Verifiable Proof of Value for the expert economy.
			</p>

			<Button
				className="mt-4"
				onClick={() =>
					state.authenticated ? navigate({ to: "/dashboard" }) : login.mutate()
				}
			>
				{state.authenticated ? "Dashboard" : "Login"}
			</Button>

			<ThemeSwitch
				variant={"secondary"}
				className="absolute right-4 bottom-4"
			/>
		</div>
	);
}
