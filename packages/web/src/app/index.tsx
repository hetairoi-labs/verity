import { createFileRoute, Link } from "@tanstack/react-router";
import ThemeSwitch from "../components/custom/theme-switch";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col items-center justify-center h-screen p-8">
			<h1 className="text-7xl lg:text-9xl uppercase">Verity</h1>
			<p className="text-2xl text-muted-foreground font-light mt-2">
				Verifiable Proof of Value for the expert economy.
			</p>

			<Link to="/dashboard" className="mt-4">
				<Button>Dashboard</Button>
			</Link>

			<ThemeSwitch
				variant={"secondary"}
				className="absolute right-4 bottom-4"
			/>
		</div>
	);
}
