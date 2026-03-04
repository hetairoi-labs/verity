import { createFileRoute } from "@tanstack/react-router";
import { Badge } from "@/src/components/ui/badge";
import { Separator } from "@/src/components/ui/separator";
import { useLive } from "@/src/lib/hooks/use-live";

function LiveIndex() {
	const live = useLive();

	return (
		<div className="flex h-screen flex-col items-center justify-center bg-background p-10 text-foreground">
			<div className="size-40 animate-pulse rounded-full bg-primary" />
			<div className="mt-10 w-full max-w-md rounded border border-border bg-card p-4 font-mono text-sm">
				<p className="mb-2 flex items-center gap-2 pb-1 text-muted-foreground">
					KEX_LIVE <Badge variant="outline">{live.status.toUpperCase()}</Badge>
				</p>
				<Separator className="mb-4" />
				{live.logs.map((log) => (
					<div
						className="font-mono text-primary"
						key={`${log.timestamp.getTime()}-${log.message}`}
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
