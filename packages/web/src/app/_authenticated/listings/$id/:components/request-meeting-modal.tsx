import { useForm, useStore } from "@tanstack/react-form";
import { z } from "zod";
import { FieldInfo } from "@/src/components/custom/field-info";
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

const requestMeetingSchema = z.object({
	summary: z.string().min(1, "Summary is required"),
	attendeeEmail: z.string().email("Invalid email format"),
});

export function RequestMeetingModal({
	open,
	onOpenChange,
	sessionId,
}: RequestMeetingModalProps) {
	const requestSession = useRequestSessionRegistrationAndEnroll();

	const form = useForm({
		defaultValues: {
			summary: "Verity Session",
			attendeeEmail: "",
		},
		validators: {
			onChange: requestMeetingSchema,
		},
		onSubmit: async ({ value }) => {
			await requestSession.execute({
				sessionId,
				summary: value.summary,
				attendees: [value.attendeeEmail],
			});
			onOpenChange(false);
		},
	});

	const canSubmit = useStore(form.store, (state) => state.canSubmit);
	const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
	const disabled = requestSession.isPending || isSubmitting;

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
					<form.Field
						children={(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Meeting Summary</Label>
								<Input
									id={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="Meeting summary"
									value={field.state.value}
								/>
								<FieldInfo field={field} />
							</div>
						)}
						name="summary"
					/>

					<form.Field
						children={(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Attendee Email</Label>
								<Input
									id={field.name}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder="attendee@example.com"
									type="email"
									value={field.state.value}
								/>
								<FieldInfo field={field} />
							</div>
						)}
						name="attendeeEmail"
					/>
				</div>
				<DialogFooter showCloseButton>
					<Button
						disabled={disabled || !canSubmit}
						onClick={() => form.handleSubmit()}
					>
						{requestSession.isPending ? "Requesting..." : "Request & Enroll"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
