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
	onOpenChange: (open: boolean) => void;
	open: boolean;
	sessionId: number;
}

export function RequestEvaluationModal({
	open,
	onOpenChange,
	sessionId,
}: RequestEvaluationModalProps) {
	const requestEvaluation = useRequestEvaluation();

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Request Evaluation</DialogTitle>
					<DialogDescription>
						Request AI evaluation for this funded session. This will analyze the
						session goals and provide feedback.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter showCloseButton>
					<Button
						disabled={requestEvaluation.isPending}
						onClick={async () => {
							await requestEvaluation.execute(sessionId);
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
