import { Panel } from "./panel";

interface SessionActionPanelProps {
	children: React.ReactNode;
	description: string;
	title: string;
}

export function SessionActionPanel(props: SessionActionPanelProps) {
	return (
		<Panel className="space-y-4">
			<div>
				<h3 className="text-xl">{props.title}</h3>
				<p className="mt-1 text-muted-foreground text-sm">
					{props.description}
				</p>
			</div>
			<div className="space-y-3">{props.children}</div>
		</Panel>
	);
}
