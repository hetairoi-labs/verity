import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useRequestSessionRegistrationAndEnroll } from "@/src/lib/hooks/actions/use-session-actions";

interface RequestMeetingModalProps {
	onOpenChange: (open: boolean) => void;
	open: boolean;
	sessionId: number;
}

export function RequestMeetingModal({
	open,
	onOpenChange,
	sessionId,
}: RequestMeetingModalProps) {
	const requestSession = useRequestSessionRegistrationAndEnroll();
	const [summary, setSummary] = useState("Verity Session");
	const [attendeesInput, setAttendeesInput] = useState("");

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Request Meeting</DialogTitle>
					<DialogDescription>
						Create meeting &rarr; approve allowance &rarr; request registration
						&rarr; wait tx receipt &rarr; enroll participant.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label>Meeting Summary</Label>
						<Input
							onChange={(e) => setSummary(e.target.value)}
							placeholder="Meeting summary"
							value={summary}
						/>
					</div>
					<div className="space-y-2">
						<Label>Attendee Emails</Label>
						<Input
							onChange={(e) => setAttendeesInput(e.target.value)}
							placeholder="host@email.com, learner@email.com"
							value={attendeesInput}
						/>
						<p className="text-muted-foreground text-xs">
							Comma separated list of emails.
						</p>
					</div>
				</div>
				<DialogFooter showCloseButton>
					<Button
						disabled={requestSession.isPending}
						onClick={async () => {
							await requestSession.execute({
								sessionId,
								summary,
								attendees: attendeesInput
									.split(",")
									.map((v) => v.trim())
									.filter(Boolean),
							});
							onOpenChange(false);
						}}
					>
						{requestSession.isPending ? "Requesting..." : "Request & Enroll"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
