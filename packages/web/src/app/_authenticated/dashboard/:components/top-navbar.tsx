import { type TopNavAction, topNavActions } from "./mock";
import { Panel } from "./panel";

export function TopNavbar({ title }: { title: string }) {
	return (
		<Panel>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h1 className="text-2xl">{title}</h1>

				<div className="flex items-center gap-2">
					{topNavActions.map((action) => (
						<TopAction action={action} key={action.label} />
					))}
				</div>
			</div>
		</Panel>
	);
}

function TopAction({ action }: { action: TopNavAction }) {
	if (action.type === "profile") {
		return (
			<button
				className="inline-flex h-9 items-center gap-2 rounded-lg border border-border/70 bg-background/60 px-3 text-muted-foreground text-sm transition-colors hover:text-foreground"
				type="button"
			>
				<action.icon size={18} />
				{action.label}
			</button>
		);
	}

	return (
		<button
			className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-background/60 text-muted-foreground transition-colors hover:text-foreground"
			type="button"
		>
			<action.icon size={18} />
		</button>
	);
}
