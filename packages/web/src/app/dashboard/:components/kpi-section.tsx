import { TrendDownIcon, TrendUpIcon } from "@phosphor-icons/react";
import { type KpiCard, kpiCards } from "./mock";
import { Panel } from "./panel";

export function KpiSection() {
	return (
		<section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
			{kpiCards.map((kpi) => (
				<KpiItem key={kpi.title} kpi={kpi} />
			))}
		</section>
	);
}

function KpiItem({ kpi }: { kpi: KpiCard }) {
	return (
		<Panel>
			<p className="text-lg md:text-xl">{kpi.title}</p>
			<div className="mt-2 flex items-baseline gap-2.5">
				<p className="text-3xl tracking-tight md:text-4xl">{kpi.value}</p>
				<p
					className={`inline-flex items-center gap-0.5 text-sm md:text-base ${
						kpi.deltaUp ? "text-primary" : "text-destructive"
					}`}
				>
					{kpi.deltaUp ? (
						<TrendUpIcon size={18} />
					) : (
						<TrendDownIcon size={18} />
					)}
					{kpi.delta}
				</p>
			</div>
			<p className="mt-2 text-muted-foreground text-sm">{kpi.description}</p>
		</Panel>
	);
}
