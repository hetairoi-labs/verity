import { XIcon } from "@phosphor-icons/react";
import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
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
	attendees: z
		.array(z.email("Invalid email format"))
		.min(1, "At least one attendee email is required"),
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
			attendees: [""],
		},
		validators: {
			onChange: requestMeetingSchema,
		},
		onSubmit: async ({ value }) => {
			await requestSession.execute({
				sessionId,
				summary: value.summary,
				attendees: value.attendees,
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

					<div className="space-y-2">
						<Label>Attendee Emails</Label>
						<form.Field
							children={(field) => (
								<div className="space-y-2">
									{field.state.value.map((_, i) => (
										<form.Field
											children={(subField) => (
												<div className="space-y-1">
													<div className="flex gap-2">
														<Input
															onBlur={subField.handleBlur}
															onChange={(e) =>
																subField.handleChange(e.target.value)
															}
															placeholder={`email${i + 1}@example.com`}
															type="email"
															value={subField.state.value}
														/>
														{field.state.value.length > 1 && (
															<Button
																onClick={() => field.removeValue(i)}
																size="icon"
																type="button"
																variant="outline"
															>
																<XIcon />
															</Button>
														)}
													</div>
													<FieldInfo field={subField} />
												</div>
											)}
											key={`attendee-${i}`}
											name={`attendees[${i}]`}
										/>
									))}
									<Button
										className="w-full"
										onClick={() => field.pushValue("")}
										size="sm"
										type="button"
										variant="outline"
									>
										+ Add Attendee
									</Button>
									<FieldInfo field={field} />
								</div>
							)}
							mode="array"
							name="attendees"
						/>
					</div>
				</div>
				<DialogFooter showCloseButton>
					<Button
						disabled={disabled || !canSubmit}
						onClick={() =>
							toast.promise(form.handleSubmit(), {
								loading: "Validating...",
								success: "Request sent",
								error: (err) =>
									err instanceof Error ? err.message : "Request failed",
							})
						}
					>
						{requestSession.isPending ? "Requesting..." : "Request & Enroll"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
