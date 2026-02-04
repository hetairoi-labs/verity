import { Button } from "@/src/components/ui/button";
import { useApi } from "@/src/lib/hooks/use-api";
import Layout from "../layout";

export function HomePage() {
	const { meet } = useApi();

	return (
		<Layout className="flex flex-col items-center justify-center h-screen p-8">
			<h1 className="text-7xl lg:text-9xl">Kex Framework</h1>
			<p className="text-2xl text-muted-foreground font-light mt-2">
				Verify Knowledge exchange using Chainlink CRE.
			</p>

			<Button onClick={() => meet.mutate({ summary: "Hello, world!" })}>
				Create Meeting
			</Button>
			{meet.isPending && <p>Creating meeting...</p>}
			{meet?.data?.event && <p>Meeting Link: {meet.data.event.hangoutLink}</p>}
		</Layout>
	);
}
