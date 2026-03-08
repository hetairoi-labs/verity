import {
	ClockCounterClockwiseIcon,
	FolderIcon,
	GearIcon,
	SquaresFourIcon,
	StarFourIcon,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { TopNavbar } from "./top-navbar";

interface DashboardShellProps {
	children: React.ReactNode;
	description?: string;
	noNav?: boolean;
	title: string;
}

const navItems = [
	{ icon: SquaresFourIcon, label: "Dashboard", to: "/dashboard" },
	{ icon: FolderIcon, label: "Browse", to: "/listings" },
	{ icon: ClockCounterClockwiseIcon, label: "History", to: "/history" },
	{ icon: GearIcon, label: "Settings", to: "/settings" },
] as const;

export function DashboardShell(props: DashboardShellProps) {
	return (
		<div className="mx-auto grid min-h-screen w-full gap-4 p-4 lg:grid-cols-[16rem_1fr]">
			<aside className="sticky top-0 hidden rounded-2xl border border-border/70 bg-card/70 p-4 lg:block">
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
							className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-muted-foreground text-sm transition-colors hover:bg-secondary/70 hover:text-foreground"
							key={item.label}
							to={item.to}
						>
							<item.icon size={20} />
							<span>{item.label}</span>
						</Link>
					))}
				</nav>
			</aside>

			<div>
				{!props.noNav && <TopNavbar className="mb-4" title={props.title} />}
				<main className="space-y-4 overflow-y-auto">{props.children}</main>
			</div>
		</div>
	);
}
