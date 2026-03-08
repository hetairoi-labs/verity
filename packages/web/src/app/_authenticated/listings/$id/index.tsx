import BannerImage from "@assets/card.webp";
import {
	CalendarPlusIcon,
	ChartBarIcon,
	ListBulletsIcon,
	PencilSimpleIcon,
	UserCircleIcon,
} from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/src/app/_authenticated/dashboard/:components/dashboard-shell";
import { Panel } from "@/src/app/_authenticated/dashboard/:components/panel";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/lib/context/auth-context";
import {
	type GetMeetingByIdResponse,
	useGetSessionMeetingsQuery,
} from "@/src/lib/hooks/api/use-meetings-api";
import { useGetSessionByIdQuery } from "@/src/lib/hooks/api/use-sessions-api";
import { truncateAddress } from "@/src/lib/utils";
import { formatUSDC } from "@/src/lib/utils/usdc";
import { RequestEvaluationModal } from "./:components/request-evaluation-modal";
import { RequestMeetingModal } from "./:components/request-meeting-modal";
import { UpdateListingModal } from "./:components/update-listing-modal";

export const Route = createFileRoute("/_authenticated/listings/$id/")({
	component: SessionDetailPage,
});

function SessionDetailPage() {
	const { id } = Route.useParams();
	const sessionId = Number(id);
	const { user } = useAuth();

	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [showEvalModal, setShowEvalModal] = useState(false);
	const [showMeetingModal, setShowMeetingModal] = useState(false);

	const { data: session } = useGetSessionByIdQuery({
		sessionId: String(sessionId),
	});
	const { data: meetings, isLoading: isMeetingsLoading } =
		useGetSessionMeetingsQuery({
			sessionId: String(sessionId),
			page: "1",
			limit: "20",
		});

	const isHost = user?.id === session?.hostId;

	return (
		<DashboardShell
			description={session?.description || "Session detail and management."}
			noNav={true}
			title={session?.title || `Session #${sessionId}`}
		>
			<div className="grid gap-4">
				{/* Banner Image */}
				<div className="relative h-64 w-full overflow-hidden rounded-2xl border border-border/70">
					<img
						alt="Session Banner"
						className="size-full object-cover"
						height={192}
						src={BannerImage}
						width={1200}
					/>
					<div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
					<div className="absolute bottom-4 left-6">
						<h2 className="text-4xl text-white">{session?.topic}</h2>
						<div className="mt-2 text-white/90 text-xl">
							{session?.price
								? `${formatUSDC(BigInt(session.price))} USDC`
								: undefined}
						</div>
					</div>
				</div>

				<div className="grid gap-4 lg:grid-cols-[1fr_360px]">
					{/* Main Content: Meetings */}
					<Panel className="space-y-4">
						<h3 className="font-medium text-lg">Meetings</h3>
						<MeetingsPanel
							isLoading={isMeetingsLoading}
							meetings={meetings ?? []}
						/>
					</Panel>

					{/* Sidebar: Actions & Goals */}
					<div className="space-y-4">
						{/* Actions Panel */}
						<Panel className="flex flex-col gap-4 p-6">
							<h3 className="font-medium text-lg">Actions</h3>
							<div className="grid grid-cols-2 gap-2">
								{isHost ? (
									<>
										<Button
											className="flex h-24 flex-col gap-2 rounded-xl"
											onClick={() => setShowUpdateModal(true)}
											variant="outline"
										>
											<PencilSimpleIcon size={24} />
											<span className="text-muted-foreground text-xs">
												Edit
											</span>
										</Button>
										<Button
											className="flex h-24 flex-col gap-2 rounded-xl"
											onClick={() => setShowEvalModal(true)}
											variant="outline"
										>
											<ChartBarIcon size={24} />
											<span className="text-center text-muted-foreground text-xs">
												Evaluation
											</span>
										</Button>
									</>
								) : (
									<Button
										className="group/button col-span-2 flex h-24 gap-2 rounded-xl group-hover:text-foreground"
										onClick={() => setShowMeetingModal(true)}
										variant="outline"
									>
										<CalendarPlusIcon size={32} />
										<span className="text-muted-foreground group-hover/button:text-foreground">
											Request Meeting
										</span>
									</Button>
								)}
							</div>
						</Panel>

						{/* Goals Panel */}
						<Panel className="space-y-4">
							<h3 className="font-medium text-lg">Goals</h3>
							<div className="space-y-2 text-muted-foreground">
								{session?.goals?.map((goal) => (
									<div
										className="flex items-center gap-2 text-sm"
										key={goal.id}
									>
										<ListBulletsIcon size={16} /> {goal.name}
									</div>
								))}
								{(!session?.goals || session.goals.length === 0) && (
									<p className="text-sm italic">No goals defined.</p>
								)}
							</div>
						</Panel>

						{/* Host Panel */}
						<Panel className="space-y-4">
							<h3 className="font-medium text-lg">Host</h3>
							<div className="flex items-center gap-3 text-muted-foreground">
								<UserCircleIcon size={32} weight="duotone" />
								<span className="font-medium text-muted-foreground">
									{user?.wallet?.address &&
										truncateAddress(user.wallet.address, 10)}
								</span>
							</div>
						</Panel>
					</div>
				</div>
			</div>

			{/* Modals */}
			<UpdateListingModal
				onOpenChange={setShowUpdateModal}
				open={showUpdateModal}
				session={session}
				sessionId={sessionId}
			/>
			<RequestEvaluationModal
				onOpenChange={setShowEvalModal}
				open={showEvalModal}
				sessionId={sessionId}
			/>
			<RequestMeetingModal
				onOpenChange={setShowMeetingModal}
				open={showMeetingModal}
				sessionId={sessionId}
			/>
		</DashboardShell>
	);
}

function MeetingsPanel({
	isLoading,
	meetings,
}: {
	isLoading: boolean;
	meetings: GetMeetingByIdResponse[];
}) {
	if (isLoading) {
		return <p className="text-muted-foreground">Loading meetings...</p>;
	}
	if (meetings.length === 0) {
		return (
			<div className="flex min-h-[200px] flex-col items-center justify-center text-center">
				<p className="text-muted-foreground">No meetings scheduled yet.</p>
			</div>
		);
	}
	return (
		<div className="grid gap-3">
			{meetings.map((meeting) => {
				const isPending = meeting.status === "pending";

				return (
					<div
						className="flex items-center justify-between rounded-xl border border-border/60 bg-card/40 p-4 transition-colors hover:bg-card/60"
						key={meeting.id}
					>
						<div className="w-full space-y-1">
							<div className="flex items-center gap-2">
								<p className="font-medium">
									{meeting.summary || "Verity Session"}
								</p>
								{isPending && (
									<Badge
										className="bg-orange-500/10 text-orange-500"
										variant="outline"
									>
										Pending
									</Badge>
								)}
							</div>
							{"createdAt" in meeting && meeting.createdAt && (
								<p className="text-muted-foreground text-xs">
									{new Date(meeting.createdAt as string).toLocaleString(
										undefined,
										{
											dateStyle: "medium",
											timeStyle: "short",
										}
									)}
								</p>
							)}
							<div className="mt-4 flex items-center gap-2">
								{isPending ? (
									<p className="text-muted-foreground text-sm italic">
										Meeting URL will be available once ready
									</p>
								) : (
									<a
										className="rounded-md bg-muted p-2 text-muted-foreground text-sm underline-offset-4 hover:underline"
										href={meeting.meetingUrl}
										rel="noopener"
										target="_blank"
									>
										{meeting.meetingUrl}
									</a>
								)}
								{!isPending && (
									<Button
										disabled={isPending}
										nativeButton={false}
										render={
											isPending ? (
												<span>Join</span>
											) : (
												<a
													href={meeting.meetingUrl}
													rel="noopener"
													target="_blank"
												>
													Join
												</a>
											)
										}
										variant="outline"
									/>
								)}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
