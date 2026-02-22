import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "../components/ui/button";

function HomePage() {
	return (
		<div className="flex flex-col items-center justify-center h-screen p-8">
			<h1 className="text-7xl lg:text-9xl uppercase">Verity</h1>
			<p className="text-2xl text-muted-foreground font-light mt-2">
				Verify Knowledge exchange using Chainlink CRE.
			</p>

			<div className="mt-10 flex gap-4">
				<Link to="/auth">
					<Button className="w-28 h-12 text-base">Auth</Button>
				</Link>
				<Link to="/test">
					<Button className="w-28 h-12 text-base">API Tests</Button>
				</Link>
				<Link to="/live">
					<Button className="w-28 h-12 text-base">Live</Button>
				</Link>
				<Link to="/form">
					<Button className="w-28 h-12 text-base">Form</Button>
				</Link>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
