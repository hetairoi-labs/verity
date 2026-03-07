import { StarFourIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Panel } from "./panel";

interface DashboardShellProps {
	children: React.ReactNode;
	description?: string;
	title: string;
}

const navItems = [
	{ label: "Dashboard", to: "/dashboard" },
	{ label: "Listings", to: "/listings" },
	{ label: "Create Listing", to: "/listings/create" },
	{ label: "History", to: "/history" },
	{ label: "Settings", to: "/settings" },
] as const;

export function DashboardShell(props: DashboardShellProps) {
	return (
		<div className="dark min-h-dvh bg-background p-3 text-foreground md:p-4">
			<div className="mx-auto grid w-full gap-4 lg:grid-cols-[16rem_1fr]">
				<aside className="hidden rounded-2xl border border-border/70 bg-card/70 p-4 lg:block">
					<div className="flex items-center gap-2.5">
						<span className="grid size-8 place-items-center rounded-full bg-secondary">
							<StarFourIcon size={16} weight="fill" />
						</span>
						<h2 className="text-xl">Verity</h2>
					</div>

					<nav className="mt-6 flex flex-col gap-1">
						{navItems.map((item) => (
							<Link
								activeProps={{ className: "bg-secondary/80 text-foreground" }}
								className="rounded-lg px-2.5 py-2 text-muted-foreground text-sm transition-colors hover:bg-secondary/70 hover:text-foreground"
								key={item.to}
								to={item.to}
							>
								{item.label}
							</Link>
						))}
					</nav>
				</aside>

				<main className="space-y-4">
					<Panel>
						<h1 className="text-2xl">{props.title}</h1>
						{props.description ? (
							<p className="mt-1 text-muted-foreground text-sm">
								{props.description}
							</p>
						) : null}
					</Panel>
					{props.children}
				</main>
			</div>
		</div>
	);
}
