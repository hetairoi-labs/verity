import { ArrowLeftIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useReadContract } from "wagmi";
import { DashboardShell } from "@/src/app/_authenticated/dashboard/:components/dashboard-shell";
import { Panel } from "@/src/app/_authenticated/dashboard/:components/panel";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { useEvmContext } from "@/src/lib/context/evm-context";
import { useFetchFromCid } from "@/src/lib/hooks/use-fetch-from-cid";
import {
	meetingEvidenceSchema,
	onchainMeetingSchema,
} from "@/src/lib/schemas/onchain-session";

export const Route = createFileRoute(
	"/_authenticated/listings/$id/results/$meetingindex"
)({
	component: MeetingResultPage,
});

function MeetingResultPage() {
	const { id, meetingindex } = Route.useParams();
	const listingId = Number(id);
	const parsedMeetingIndex = Number(meetingindex);
	const isMeetingIndexValid = Number.isFinite(parsedMeetingIndex);
	const onchainMeetingIndex = isMeetingIndexValid
		? BigInt(parsedMeetingIndex)
		: 0n;

	const { contracts } = useEvmContext();

	const { data: onchainSession } = useReadContract({
		address: contracts?.SessionRegistry.address,
		abi: contracts?.SessionRegistry.abi,
		functionName: "getSession",
		args: [onchainMeetingIndex],
		query: {
			enabled: Boolean(
				contracts?.SessionRegistry.address && isMeetingIndexValid
			),
		},
	});

	const onchainSessionResult = onchainMeetingSchema.safeParse(onchainSession);
	const parsedOnchainSession = onchainSessionResult.success
		? onchainSessionResult.data
		: undefined;
	const evidenceCid = parsedOnchainSession?.evidenceCID.trim() || undefined;

	const { data: evidenceData } = useFetchFromCid({
		cid: evidenceCid,
		schema: meetingEvidenceSchema,
		queryKeyPrefix: "meetingEvidence",
	});
	let onchainSectionContent: React.ReactNode;
	if (!isMeetingIndexValid) {
		onchainSectionContent = (
			<p className="text-muted-foreground text-sm">Invalid meeting index.</p>
		);
	} else if (parsedOnchainSession) {
		onchainSectionContent = (
			<div className="grid gap-2 rounded-xl border border-border/70 bg-background/60 p-4 text-sm">
				<DataRow label="Teacher" value={parsedOnchainSession.teacher} />
				<DataRow label="Learner" value={parsedOnchainSession.learner} />
				<DataRow
					label="Amount"
					value={parsedOnchainSession.amount.toString()}
				/>
				<DataRow label="Status" value={String(parsedOnchainSession.status)} />
				<DataRow
					label="Confidence Bps"
					value={String(parsedOnchainSession.confidenceBps)}
				/>
				<DataRow
					label="Learning Bps"
					value={String(parsedOnchainSession.learningBps)}
				/>
				<DataRow
					label="Teacher Claimable"
					value={parsedOnchainSession.teacherClaimable.toString()}
				/>
				<DataRow
					label="Learner Refundable"
					value={parsedOnchainSession.learnerRefundable.toString()}
				/>
				<DataRow
					label="Evaluated At"
					value={parsedOnchainSession.evaluatedAt.toString()}
				/>
				<DataRow label="Data CID" value={parsedOnchainSession.dataCID} />
				<DataRow
					label="Evidence CID"
					value={parsedOnchainSession.evidenceCID || "-"}
				/>
			</div>
		);
	} else {
		onchainSectionContent = (
			<p className="text-muted-foreground text-sm">
				No onchain session data available.
			</p>
		);
	}

	return (
		<DashboardShell
			description="Onchain and evidence data for this meeting."
			noNav={true}
			title={`Meeting Result #${meetingindex}`}
		>
			<div className="space-y-4">
				<Button nativeButton={false} variant="ghost">
					<Link params={{ id: String(listingId) }} to="/listings/$id">
						<ArrowLeftIcon size={16} />
						Back to Listing
					</Link>
				</Button>

				<Panel className="space-y-4">
					<div className="flex items-center gap-2">
						<h3 className="font-medium text-lg">Onchain Session</h3>
						{evidenceCid ? (
							<Badge
								className="bg-emerald-500/10 text-emerald-600"
								variant="outline"
							>
								Finished
							</Badge>
						) : (
							<Badge
								className="bg-orange-500/10 text-orange-500"
								variant="outline"
							>
								Not Finished
							</Badge>
						)}
					</div>

					{onchainSectionContent}
				</Panel>

				<Panel className="space-y-4">
					<h3 className="font-medium text-lg">Evidence Data</h3>
					{evidenceData ? (
						<div className="space-y-3 rounded-xl border border-border/70 bg-background/60 p-4 text-sm">
							<DataRow label="Score" value={String(evidenceData.score)} />
							<div>
								<p className="font-medium text-muted-foreground text-xs uppercase">
									Reasoning
								</p>
								<p className="mt-1 whitespace-pre-wrap text-sm">
									{evidenceData.reasoning}
								</p>
							</div>
							<div>
								<p className="font-medium text-muted-foreground text-xs uppercase">
									Improvements
								</p>
								<ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
									{evidenceData.improvements.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</div>
						</div>
					) : (
						<p className="text-muted-foreground text-sm">
							No evidence data available yet.
						</p>
					)}
				</Panel>
			</div>
		</DashboardShell>
	);
}

function DataRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-2">
			<p className="font-medium text-muted-foreground text-xs uppercase">
				{label}
			</p>
			<p className="break-all">{value}</p>
		</div>
	);
}
