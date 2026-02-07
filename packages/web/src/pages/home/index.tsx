import { Button } from "@/src/components/ui/button";
import { useApi } from "@/src/lib/hooks/use-api";
import { useWs } from "@/src/lib/hooks/use-ws";
import Layout from "../layout";

export function HomePage() {
	const { meet } = useApi();
	const { time } = useWs();

	return (
		<Layout className="flex flex-col items-center justify-center h-screen p-8">
			<h1 className="text-7xl lg:text-9xl">Kex Framework</h1>
			<p className="text-2xl text-muted-foreground font-light mt-2">
				Verify Knowledge exchange using Chainlink CRE.
			</p>

			<div className="mt-10 flex flex-col gap-4 items-center">
				<Button
					className="w-fit"
					onClick={() => meet.mutate({ summary: "Hello, world!" })}
				>
					Create Meeting
				</Button>
				{meet.isPending && <p>Creating meeting...</p>}
				{meet?.data?.event && (
					<p>
						Meeting Link:{" "}
						<a
							href={meet.data.event.hangoutLink ?? ""}
							target="_blank"
							rel="noopener noreferrer"
							className="text-cyan-500 underline"
						>
							{meet.data.event.hangoutLink}
						</a>
					</p>
				)}
			</div>

			<p className="text-muted-foreground fixed bottom-4 left-4">
				{time.data.join(", ")}
			</p>
		</Layout>
	);
}
