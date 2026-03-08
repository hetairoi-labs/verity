import { Button } from "@/src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/src/components/ui/dialog";
import { useRequestEvaluation } from "@/src/lib/hooks/actions/use-session-actions";

interface RequestEvaluationModalProps {
	meetingIndex?: number;
	meetingUrl?: string;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export function RequestEvaluationModal({
	meetingIndex,
	meetingUrl,
	open,
	onOpenChange,
}: RequestEvaluationModalProps) {
	const requestEvaluation = useRequestEvaluation();

	const canSubmit = meetingIndex != null && meetingUrl != null;

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Request Evaluation</DialogTitle>
					<DialogDescription>
						Request AI evaluation for a registered meeting. This analyzes the
						meeting transcript and session goals.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter showCloseButton>
					<Button
						disabled={requestEvaluation.isPending || !canSubmit}
						onClick={() => {
							if (!canSubmit) {
								return;
							}
							requestEvaluation.execute({
								meetingIndex,
								meetingUrl: meetingUrl as string,
							});
							onOpenChange(false);
						}}
					>
						{requestEvaluation.isPending ? "Requesting..." : "Confirm Request"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
