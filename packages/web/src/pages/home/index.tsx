import { Link } from "@tanstack/react-router";
import Layout from "../layout";

export function HomePage() {
	return (
		<Layout className="flex flex-col items-center justify-center h-screen p-8">
			<h1 className="text-7xl lg:text-9xl">KEX</h1>
			<p className="text-2xl text-muted-foreground font-light mt-2">
				Verify Knowledge exchange using Chainlink CRE.
			</p>

			<div className="mt-10">
				<Link
					to="/test"
					className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
				>
					API Tests
				</Link>
			</div>
		</Layout>
	);
}
