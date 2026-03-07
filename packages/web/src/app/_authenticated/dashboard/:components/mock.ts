import type { Icon } from "@phosphor-icons/react";
import {
	BellIcon,
	CalendarBlankIcon,
	DotsThreeIcon,
	FolderIcon,
	FunnelSimpleIcon,
	GlobeIcon,
	LinkSimpleIcon,
	MagnifyingGlassIcon,
	PencilSimpleIcon,
	SquaresFourIcon,
	UserCircleIcon,
} from "@phosphor-icons/react";

export interface SideNavItem {
	icon: Icon;
	label: string;
}

export interface TopNavTab {
	active?: boolean;
	label: string;
}

export interface TopNavAction {
	icon: Icon;
	label: string;
	type: "icon" | "profile";
}

export interface KpiCard {
	delta: string;
	deltaUp: boolean;
	description: string;
	title: string;
	value: string;
}

export const sideNavItems: SideNavItem[] = [
	{ icon: SquaresFourIcon, label: "Dashboard" },
	{ icon: FolderIcon, label: "Sessions" },
	{ icon: LinkSimpleIcon, label: "Goals library" },
	{ icon: GlobeIcon, label: "Learner discovery" },
	{ icon: PencilSimpleIcon, label: "Create session" },
];

export const topNavTabs: TopNavTab[] = [
	{ label: "Overview", active: true },
	{ label: "Sessions" },
	{ label: "Settlements" },
	{ label: "Insights" },
];

export const topNavActions: TopNavAction[] = [
	{ icon: MagnifyingGlassIcon, label: "Search", type: "icon" },
	{ icon: BellIcon, label: "Notifications", type: "icon" },
	{ icon: UserCircleIcon, label: "Host", type: "profile" },
];

export const kpiCards: KpiCard[] = [
	{
		title: "Escrow locked",
		value: "320 USDC",
		delta: "8%",
		deltaUp: true,
		description: "Across upcoming sessions",
	},
	{
		title: "Average merit score",
		value: "87%",
		delta: "4%",
		deltaUp: true,
		description: "Last 10 settled sessions",
	},
	{
		title: "Pending claims",
		value: "2",
		delta: "1",
		deltaUp: false,
		description: "Require finalization",
	},
];

export const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "Jul", "Aug"];

export const bars = [
	[20, 28, 100],
	[10, 55, 95],
	[6, 88, 62],
	[40, 22, 96],
	[6, 28, 84],
	[6, 42, 68],
	[40, 26, 82],
	[6, 28, 52],
];

export const insights = [
	"Session VERITY-AX41 has low clarity score - add a recap segment in the final 10 minutes.",
	"Goal weight balance is skewed toward theory - add one applied milestone for higher completion.",
	"Learners from your last 5 sessions improved faster when check-ins happened every 15 minutes.",
];

export const quickActions = [
	"Create a new host session",
	"Request evaluation on completed call",
	"Claim available teacher payout",
];

export const chartFilters = [
	{ icon: CalendarBlankIcon, label: "Date" },
	{ icon: FunnelSimpleIcon, label: "View" },
];

export const insightHeaderActions = [{ icon: DotsThreeIcon, label: "More" }];
