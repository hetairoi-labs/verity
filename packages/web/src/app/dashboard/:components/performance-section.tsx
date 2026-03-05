import { CaretDownIcon } from "@phosphor-icons/react";
import { bars, chartFilters, months } from "./mock";
import { Panel } from "./panel";

export function PerformanceSection() {
	return (
		<Panel className="py-12">
			<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
				<div>
					<h3 className="text-2xl md:text-3xl">Session Performance</h3>
					<p className="mt-1 text-muted-foreground text-sm md:text-base">
						Track host outcomes and learner impact
					</p>
				</div>

				<div className="flex items-center gap-4 text-muted-foreground text-sm">
					{chartFilters.map((filter) => (
						<button
							className="flex items-center gap-1.5"
							key={filter.label}
							type="button"
						>
							<filter.icon size={18} />
							{filter.label}
							<CaretDownIcon size={14} />
						</button>
					))}
				</div>
			</div>

			<div className="mt-6 overflow-x-auto">
				<div className="min-w-176">
					<div className="grid grid-cols-[3rem_1fr] gap-4">
						<div className="flex h-52 flex-col items-start justify-between text-muted-foreground text-xs md:text-sm">
							<span>1,500</span>
							<span>1,000</span>
							<span>500</span>
							<span>0</span>
						</div>

						<div className="space-y-4">
							<div className="grid grid-cols-8 gap-3 md:gap-4">
								{bars.map((group, idx) => (
									<div
										className="flex flex-col items-center gap-2"
										key={months[idx]}
									>
										<div className="flex h-52 items-end gap-1">
											{group.map((barHeight, barIndex) => (
												<div
													className="w-3 rounded-sm bg-primary"
													key={`${months[idx]}-${barIndex}`}
													style={{ height: `${barHeight}%` }}
												/>
											))}
										</div>
										<p className="text-muted-foreground text-xs md:text-sm">
											{months[idx]}
										</p>
									</div>
								))}
							</div>

							<div className="flex items-center justify-center gap-5 text-muted-foreground text-xs md:text-sm">
								<Legend label="Scope 1" />
								<Legend label="Scope 2" />
								<Legend label="Scope 3" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</Panel>
	);
}

function Legend({ label }: { label: string }) {
	return (
		<div className="flex items-center gap-1.5">
			<span className="size-2 rounded-full bg-primary" />
			<span>{label}</span>
		</div>
	);
}
