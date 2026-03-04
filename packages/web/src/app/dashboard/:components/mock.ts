import type { Icon } from "@phosphor-icons/react";
import {
	HouseIcon,
	KanbanIcon,
	SignInIcon,
	StorefrontIcon,
	TableIcon,
	UserIcon,
} from "@phosphor-icons/react";

export interface NavItem {
	active?: boolean;
	href: string;
	icon: Icon;
	label: string;
}

export const sidebarNav: NavItem[] = [
	{ label: "Dashboard", icon: HouseIcon, href: "/dashboard", active: true },
	{ label: "NFT Marketplace", icon: StorefrontIcon, href: "#" },
	{ label: "Tables", icon: TableIcon, href: "#" },
	{ label: "Kanban", icon: KanbanIcon, href: "#" },
	{ label: "Profile", icon: UserIcon, href: "#" },
	{ label: "Sign In", icon: SignInIcon, href: "#" },
];

export const profile = {
	name: "Adela Parkson",
	role: "Product Designer",
	stats: [
		{ label: "Posts", value: "17" },
		{ label: "Following", value: "9.7k" },
		{ label: "Followers", value: "274" },
	],
};

export const storage = {
	used: 25.6,
	total: 50,
	label: "Your storage",
	description: "Supervise your drive space in the easiest way",
};

export const projects = [
	{
		id: 1,
		title: "Technology behind the Blockchain",
		number: "Project #1",
		link: "See project details",
	},
	{
		id: 2,
		title: "Greatest way to a good Economy",
		number: "Project #2",
		link: "See project details",
	},
	{
		id: 3,
		title: "Most essential tips for Burnout",
		number: "Project #3",
		link: "See project details",
	},
];

export const generalInfo = {
	bio: "As we live, our hearts turn colder. Cause pain is what we go through as we become older. We get insulted by others, lose trust for those others. We get back stabbed by friends. It becomes harder for us to give others a hand. We get our heart broken by people we love, even that we give them all...",
	fields: [
		{ label: "Education", value: "Stanford University" },
		{ label: "Languages", value: "English, Spanish, Italian" },
		{ label: "Department", value: "Product Design" },
		{ label: "Work History", value: "Google, Facebook" },
		{ label: "Organization", value: "Simmmple Web LLC" },
		{ label: "Birthday", value: "20 July 1986" },
	],
};

export const notifications = [
	{ id: "item-update", label: "Item update notifications", enabled: true },
	{ id: "item-comment", label: "Item comment notifications", enabled: false },
	{ id: "buyer-review", label: "Buyer review notifications", enabled: true },
	{
		id: "rating-reminders",
		label: "Rating reminders notifications",
		enabled: false,
	},
	{
		id: "meetups-near",
		label: "Meetups near you notifications",
		enabled: false,
	},
	{
		id: "company-news",
		label: "Company news notifications",
		enabled: true,
	},
	{
		id: "new-launches",
		label: "New launches and projects",
		enabled: true,
	},
	{
		id: "monthly-product",
		label: "Monthly product changes",
		enabled: false,
	},
	{
		id: "subscribe-newsletter",
		label: "Subscribe to newsletter",
		enabled: true,
	},
	{
		id: "email-follows",
		label: "Email me when someone follows me",
		enabled: true,
	},
];

export const footerLinks = [
	{ label: "Marketplace", href: "#" },
	{ label: "License", href: "#" },
	{ label: "Terms of Use", href: "#" },
	{ label: "Blog", href: "#" },
];
