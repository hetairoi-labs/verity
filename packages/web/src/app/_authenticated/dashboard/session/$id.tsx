import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/src/app/_authenticated/dashboard/:components/dashboard-shell";
import { Panel } from "@/src/app/_authenticated/dashboard/:components/panel";
import { SessionActionPanel } from "@/src/app/_authenticated/dashboard/:components/session-action-panel";
import { ListingForm } from "@/src/app/_authenticated/listings/:components/listing-form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
	useRequestEvaluation,
	useRequestSessionRegistrationAndEnroll,
	useUpdateListing,
} from "@/src/lib/hooks/actions/use-session-actions";
import { useGetSessionMeetingsQuery } from "@/src/lib/hooks/api/use-meetings-api";
import { useGetSessionByIdQuery } from "@/src/lib/hooks/api/use-sessions-api";
import { formatUSDC } from "@/src/lib/utils/usdc";

export const Route = createFileRoute("/_authenticated/dashboard/session/$id")({
	component: SessionDetailPage,
});

interface SessionInfo {
	description?: string | null;
	email?: string;
	goals?: Array<{ id: number; name: string }>;
	hostId?: string;
	meetingsCount?: number;
	price?: string;
	title?: string;
	topic?: string;
}

interface MeetingInfo {
	id: number;
	meetingUrl: string;
	summary?: string | null;
}

function SessionInfoPanel({
	isLoading,
	session,
}: {
	isLoading: boolean;
	session?: SessionInfo;
}) {
	if (isLoading) {
		return <p className="text-muted-foreground">Loading session...</p>;
	}
	return (
		<>
			<p className="text-xl">{session?.title ?? "-"}</p>
			<p className="text-muted-foreground text-sm">{session?.topic ?? "-"}</p>
			<div className="grid gap-2 text-sm md:grid-cols-3">
				<p>
					Price: {session?.price ? formatUSDC(BigInt(session.price)) : "-"} USDC
				</p>
				<p>Meetings Count: {session?.meetingsCount ?? 0}</p>
				<p>Host: {session?.hostId ?? "-"}</p>
			</div>
		</>
	);
}

function HostPanel({
	session,
	sessionId,
	showEdit,
	onToggleEdit,
}: {
	session?: SessionInfo;
	sessionId: number;
	showEdit: boolean;
	onToggleEdit: () => void;
}) {
	const updateListing = useUpdateListing();
	const requestEvaluation = useRequestEvaluation();
	const goalDefaults = session?.goals ?? [];

	return (
		<div className="space-y-4">
			<SessionActionPanel
				description="Submit updateListing on-chain, then update API session data."
				title="Update Listing"
			>
				<Button onClick={onToggleEdit} variant="outline">
					{showEdit ? "Hide Edit Form" : "Edit Listing"}
				</Button>
				{showEdit ? (
					<ListingForm
						defaultValues={{
							title: session?.title ?? "",
							email: session?.email ?? "",
							topic: session?.topic ?? "",
							description: session?.description ?? "",
							price: session?.price ? formatUSDC(BigInt(session.price)) : "1",
							goals: goalDefaults.map((g) => g.name),
						}}
						isPending={updateListing.isPending}
						onSubmit={(value) => updateListing.execute(sessionId, value)}
						submitLabel={
							updateListing.isPending ? "Updating..." : "Update listing"
						}
					/>
				) : null}
			</SessionActionPanel>

			<SessionActionPanel
				description="Request AI evaluation for this funded session."
				title="Request Evaluation"
			>
				<Button
					disabled={requestEvaluation.isPending}
					onClick={() => requestEvaluation.execute(sessionId)}
				>
					{requestEvaluation.isPending ? "Requesting..." : "Request Evaluation"}
				</Button>
			</SessionActionPanel>
		</div>
	);
}

function LearnerPanel({
	sessionId,
	summary,
	attendeesInput,
	onSummaryChange,
	onAttendeesChange,
}: {
	sessionId: number;
	summary: string;
	attendeesInput: string;
	onSummaryChange: (value: string) => void;
	onAttendeesChange: (value: string) => void;
}) {
	const requestSession = useRequestSessionRegistrationAndEnroll();

	return (
		<SessionActionPanel
			description="Create meeting -> approve allowance -> request registration -> wait tx receipt -> enroll participant."
			title="Request Meeting"
		>
			<div className="space-y-2">
				<Input
					onChange={(e) => onSummaryChange(e.target.value)}
					placeholder="Meeting summary"
					value={summary}
				/>
				<Input
					onChange={(e) => onAttendeesChange(e.target.value)}
					placeholder="Attendee emails (comma separated)"
					value={attendeesInput}
				/>
			</div>
			<Button
				disabled={requestSession.isPending}
				onClick={() =>
					requestSession.execute({
						sessionId,
						summary,
						attendees: attendeesInput
							.split(",")
							.map((v) => v.trim())
							.filter(Boolean),
					})
				}
			>
				{requestSession.isPending
					? "Requesting..."
					: "Request Meeting + Enroll"}
			</Button>
		</SessionActionPanel>
	);
}

function GoalsPanel({ goals }: { goals: Array<{ id: number; name: string }> }) {
	if (goals.length === 0) {
		return <p className="text-muted-foreground text-sm">No goals available.</p>;
	}
	return (
		<>
			{goals.map((goal) => (
				<div
					className="rounded-lg border border-border/60 bg-card/40 p-3 text-sm"
					key={goal.id}
				>
					{goal.name}
				</div>
			))}
		</>
	);
}

function MeetingsPanel({
	isLoading,
	meetings,
}: {
	isLoading: boolean;
	meetings: MeetingInfo[];
}) {
	if (isLoading) {
		return <p className="text-muted-foreground">Loading meetings...</p>;
	}
	if (meetings.length === 0) {
		return <p className="text-muted-foreground text-sm">No meetings yet.</p>;
	}
	return (
		<>
			{meetings.map((meeting) => (
				<div
					className="rounded-lg border border-border/60 bg-card/40 p-3 text-sm"
					key={meeting.id}
				>
					<p>{meeting.summary || "Verity Session"}</p>
					<a
						className="text-primary underline-offset-4 hover:underline"
						href={meeting.meetingUrl}
						rel="noopener"
						target="_blank"
					>
						{meeting.meetingUrl}
					</a>
				</div>
			))}
		</>
	);
}

function SessionDetailPage() {
	const { id } = Route.useParams();
	const sessionId = Number(id);
	const [tab, setTab] = useState<"host" | "learner">("host");
	const [showEdit, setShowEdit] = useState(false);
	const [attendeesInput, setAttendeesInput] = useState("");
	const [summary, setSummary] = useState("Verity Session");

	const { data: session, isLoading: isSessionLoading } = useGetSessionByIdQuery(
		{ sessionId: String(sessionId) }
	);
	const { data: meetings, isLoading: isMeetingsLoading } =
		useGetSessionMeetingsQuery({
			sessionId: String(sessionId),
			page: "1",
			limit: "20",
		});

	return (
		<DashboardShell
			description="Shared detail page for host and learner actions."
			title={`Session #${sessionId}`}
		>
			<Panel className="space-y-3">
				<SessionInfoPanel isLoading={isSessionLoading} session={session} />
			</Panel>

			<Panel className="space-y-3">
				<div className="flex items-center gap-2">
					<Button
						onClick={() => setTab("host")}
						variant={tab === "host" ? "default" : "outline"}
					>
						Host
					</Button>
					<Button
						onClick={() => setTab("learner")}
						variant={tab === "learner" ? "default" : "outline"}
					>
						Learner
					</Button>
				</div>

				{tab === "host" ? (
					<HostPanel
						onToggleEdit={() => setShowEdit((c) => !c)}
						session={session}
						sessionId={sessionId}
						showEdit={showEdit}
					/>
				) : (
					<LearnerPanel
						attendeesInput={attendeesInput}
						onAttendeesChange={setAttendeesInput}
						onSummaryChange={setSummary}
						sessionId={sessionId}
						summary={summary}
					/>
				)}
			</Panel>

			<Panel className="space-y-3">
				<h3 className="text-lg">Goals</h3>
				<GoalsPanel goals={session?.goals ?? []} />
			</Panel>

			<Panel className="space-y-3">
				<h3 className="text-lg">Meetings</h3>
				<MeetingsPanel
					isLoading={isMeetingsLoading}
					meetings={meetings ?? []}
				/>
			</Panel>
		</DashboardShell>
	);
}
