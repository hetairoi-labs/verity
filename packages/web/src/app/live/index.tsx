import { createFileRoute } from "@tanstack/react-router";
import { useAudio } from "@/src/lib/hooks/use-audio";

function LiveIndex() {
	const { logs } = useAudio();

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-10">
			<div className="size-40 bg-primary rounded-full animate-pulse" />
			<div className="mt-10 font-mono text-sm bg-card p-4 border border-border rounded w-full max-w-md">
				<p className="text-muted-foreground mb-2 border-b border-border pb-1">
					KEX_LIVE
				</p>
				{logs.map((log) => (
					<div
						key={`${log.timestamp.getTime()}-${log.message}`}
						className="text-primary font-mono"
					>
						{log.message}
					</div>
				))}
			</div>
		</div>
	);
}

export const Route = createFileRoute("/live/")({
	component: LiveIndex,
});
