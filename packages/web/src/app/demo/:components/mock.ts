export interface DemoStep {
	group: "Start" | "Host" | "Learner" | "Shared";
	id: string;
	label: string;
	path: string;
}

export interface SuccessGoal {
	description: string;
	id: string;
	weight: number;
}

export interface SessionSummary {
	amountUsdc: number;
	code: string;
	durationMinutes: number;
	id: string;
	meetingUrl: string;
	platform: "Zoom" | "Google Meet" | "Microsoft Teams";
	status:
		| "created"
		| "funded"
		| "active"
		| "completed"
		| "evaluating"
		| "evaluated"
		| "finalized"
		| "claimed";
	topic: string;
}

export const demoSteps: DemoStep[] = [
	{ id: "start", label: "Flow Start", path: "/demo", group: "Start" },
	{ id: "login", label: "Login", path: "/demo/login", group: "Start" },
	{
		id: "onboarding",
		label: "Onboarding",
		path: "/demo/onboarding",
		group: "Start",
	},
	{
		id: "host-dashboard",
		label: "Host Dashboard",
		path: "/demo/host/dashboard",
		group: "Host",
	},
	{
		id: "host-create-details",
		label: "Create - Details",
		path: "/demo/host/create/details",
		group: "Host",
	},
	{
		id: "host-create-goals",
		label: "Create - Goals",
		path: "/demo/host/create/goals",
		group: "Host",
	},
	{
		id: "host-create-share",
		label: "Create - Share",
		path: "/demo/host/create/share",
		group: "Host",
	},
	{
		id: "learner-join",
		label: "Learner Join",
		path: "/demo/learner/join",
		group: "Learner",
	},
	{
		id: "learner-dashboard",
		label: "Learner Dashboard",
		path: "/demo/learner/dashboard",
		group: "Learner",
	},
	{
		id: "session-live",
		label: "Session Live",
		path: "/demo/session/live",
		group: "Shared",
	},
	{
		id: "session-evaluating",
		label: "Evaluating",
		path: "/demo/session/evaluating",
		group: "Shared",
	},
	{
		id: "session-results",
		label: "Results",
		path: "/demo/session/results",
		group: "Shared",
	},
];

export const hostProfile = {
	name: "Alice Chen",
	meritScore: 4.8,
	role: "Smart Contract Mentor",
	sessionsCompleted: 25,
};

export const learnerProfile = {
	name: "Rohan Gupta",
	role: "Learner",
	target: "Ship first ERC-20 contract",
	wallet: "0x61B9...A3f2",
};

export const activeSession: SessionSummary = {
	id: "sess_erc20_001",
	topic: "ERC-20 Deployment Masterclass",
	durationMinutes: 60,
	amountUsdc: 50,
	platform: "Zoom",
	code: "VERITY-ABC123",
	meetingUrl: "https://zoom.us/j/verity-abc123",
	status: "funded",
};

export const successGoals: SuccessGoal[] = [
	{
		id: "goal-deploy",
		description: "Deploy ERC-20 contract to testnet",
		weight: 5,
	},
	{
		id: "goal-economics",
		description: "Explain token economics and supply design",
		weight: 4,
	},
	{
		id: "goal-debug",
		description: "Debug two common deployment failures",
		weight: 3,
	},
];

export const hostDashboardCards = [
	{ id: "upcoming", label: "Upcoming Sessions", value: "3" },
	{ id: "earnings", label: "Pending Earnings", value: "94.75 USDC" },
	{ id: "merit", label: "Merit Score", value: "4.8 / 5.0" },
] as const;

export const learnerDashboardCards = [
	{ id: "active", label: "Active Sessions", value: "1" },
	{ id: "refund", label: "Pending Refund", value: "7.75 USDC" },
	{ id: "learning", label: "Avg Learning Score", value: "87%" },
] as const;

export const evaluationBreakdown = [
	{ id: "relevance", label: "Topic Relevance", score: 90 },
	{ id: "depth", label: "Depth", score: 84 },
	{ id: "engagement", label: "Engagement", score: 88 },
	{ id: "clarity", label: "Clarity", score: 83 },
] as const;

export const settlement = {
	confidence: 85,
	learning: 85,
	formula: "((confidence + learning) / 2)^2",
	learnerRefund: 7.75,
	overallScore: 85,
	sessionAmount: 50,
	teacherPayout: 42.25,
} as const;

export const onboardingChecklist = [
	{ id: "wallet", label: "Wallet connected", done: true },
	{ id: "role", label: "Choose role (host / learner)", done: true },
	{ id: "network", label: "Switch to Verity network", done: true },
	{ id: "profile", label: "Complete profile", done: false },
] as const;
