import { createFileRoute, Link } from "@tanstack/react-router";

function HomePage() {
	return (
		<div className="flex flex-col items-center justify-center h-screen p-8">
			<h1 className="text-7xl lg:text-9xl">KEX</h1>
			<p className="text-2xl text-muted-foreground font-light mt-2">
				Verify Knowledge exchange using Chainlink CRE.
			</p>

			<div className="mt-10 flex gap-4">
				<Link
					to="/test"
					className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
				>
					API Tests
				</Link>
				<Link
					to="/live"
					className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
				>
					Live
				</Link>
				<Link
					to="/form"
					className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
				>
					Form
				</Link>
			</div>
		</div>
	);
}

export const Route = createFileRoute("/")({
	component: HomePage,
});
