import Layout from "../layout";

export function HomePage() {
	return (
		<Layout className="flex flex-col items-center justify-center h-screen p-8">
			<h1 className="text-7xl lg:text-9xl">Kex Framework</h1>
			<p className="text-2xl text-muted-foreground font-light mt-2">
				Verify Knowledge exchange using Chainlink CRE.
			</p>
		</Layout>
	);
}
