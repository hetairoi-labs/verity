import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { useLive } from "@/src/lib/hooks/use-live";

function LiveIndex() {
	const live = useLive();

	return (
		<div className="flex flex-col items-center justify-center h-screen bg-background text-foreground p-10">
			<div className="size-40 bg-primary rounded-full animate-pulse" />
			<div className="mt-10 font-mono text-sm bg-card p-4 border border-border rounded w-full max-w-md">
				<p className="text-muted-foreground mb-2 pb-1 flex items-center gap-2">
					KEX_LIVE <Badge variant="outline">{live.status.toUpperCase()}</Badge>
				</p>
				<Separator className="mb-4" />
				{live.logs.map((log) => (
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

export const Route = createFileRoute("/test/live/")({
	component: LiveIndex,
});
