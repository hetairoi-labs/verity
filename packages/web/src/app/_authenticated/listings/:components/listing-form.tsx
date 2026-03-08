import { XIcon } from "@phosphor-icons/react";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import type { ListingFormInput } from "@/src/lib/hooks/actions/use-session-actions";
import { useListingDraftStore } from "@/src/lib/store/use-listing-draft-store";
import { parseUSDC } from "@/src/lib/utils/usdc";

interface ListingFormValues {
	description: string;
	email: string;
	goals: string[];
	price: string;
	title: string;
	topic: string;
}

export interface ListingFormProps {
	isPending?: boolean;
	onSubmit: (value: ListingFormInput) => Promise<unknown>;
	submitLabel: string;
}

const mapFormToListing = (value: ListingFormValues): ListingFormInput => ({
	topic: value.topic,
	price: value.price,
	metadata: {
		title: value.title,
		email: value.email,
		description: value.description || undefined,
	},
	goals: value.goals
		.filter((goal) => goal.trim() !== "")
		.map((goal) => ({ name: goal, weight: 1 })),
});

const validateValues = (value: ListingFormValues) => {
	if (!value.title.trim()) {
		throw new Error("Title is required");
	}
	if (!value.email.trim()) {
		throw new Error("Email is required");
	}
	if (!value.topic.trim()) {
		throw new Error("Topic is required");
	}
	if (parseUSDC(value.price) < parseUSDC("1")) {
		throw new Error("Price must be at least 1 USDC");
	}
	if (value.goals.filter((g) => g.trim() !== "").length === 0) {
		throw new Error("At least one goal is required");
	}
};

export function ListingForm(props: ListingFormProps) {
	const { draft, updateDraft } = useListingDraftStore();

	const form = useForm({
		defaultValues: draft,
		onSubmit: async ({ value }) => {
			validateValues(value);
			await props.onSubmit(mapFormToListing(value));
		},
	});

	const formValues = useStore(form.store, (state) => state.values);

	useEffect(() => {
		updateDraft(formValues);
	}, [formValues, updateDraft]);

	const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
	const disabled = props.isPending || isSubmitting;

	return (
		<div className="space-y-4">
			<form.Field name="title">
				{(field) => (
					<div className="space-y-1.5">
						<Label
							className="font-medium text-[#A1A1A1] text-xs uppercase tracking-wider"
							htmlFor={field.name}
						>
							Title
						</Label>
						<Input
							className="h-10 border-white/5 bg-[#141414] focus-visible:border-white/20 focus-visible:ring-0"
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
							placeholder="Solidity for product engineers"
							value={field.state.value}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name="email">
				{(field) => (
					<div className="space-y-1.5">
						<Label
							className="font-medium text-[#A1A1A1] text-xs uppercase tracking-wider"
							htmlFor={field.name}
						>
							Email
						</Label>
						<Input
							className="h-10 border-white/5 bg-[#141414] focus-visible:border-white/20 focus-visible:ring-0"
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
							placeholder="host@email.com"
							value={field.state.value}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name="topic">
				{(field) => (
					<div className="space-y-1.5">
						<Label
							className="font-medium text-[#A1A1A1] text-xs uppercase tracking-wider"
							htmlFor={field.name}
						>
							Topic
						</Label>
						<Input
							className="h-10 border-white/5 bg-[#141414] focus-visible:border-white/20 focus-visible:ring-0"
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
							placeholder="Blockchain development"
							value={field.state.value}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name="description">
				{(field) => (
					<div className="space-y-1.5">
						<Label
							className="font-medium text-[#A1A1A1] text-xs uppercase tracking-wider"
							htmlFor={field.name}
						>
							Description
						</Label>
						<Input
							className="h-10 border-white/5 bg-[#141414] focus-visible:border-white/20 focus-visible:ring-0"
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
							placeholder="One-line context for learners"
							value={field.state.value}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name="price">
				{(field) => (
					<div className="space-y-1.5">
						<Label
							className="font-medium text-[#A1A1A1] text-xs uppercase tracking-wider"
							htmlFor={field.name}
						>
							Price (USDC)
						</Label>
						<Input
							className="h-10 border-white/5 bg-[#141414] focus-visible:border-white/20 focus-visible:ring-0"
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
							placeholder="1"
							type="text"
							value={field.state.value}
						/>
					</div>
				)}
			</form.Field>

			<div className="space-y-2">
				<Label className="font-medium text-[#A1A1A1] text-xs uppercase tracking-wider">
					Goals
				</Label>
				<form.Field mode="array" name="goals">
					{(field) => (
						<div className="space-y-2">
							{field.state.value.map((_, i) => (
								<form.Field key={`goal-${i}`} name={`goals[${i}]`}>
									{(subField) => (
										<div className="flex gap-2">
											<Input
												className="h-10 border-white/5 bg-[#141414] focus-visible:border-white/20 focus-visible:ring-0"
												onBlur={subField.handleBlur}
												onChange={(e) => subField.handleChange(e.target.value)}
												placeholder={`Goal ${i + 1}`}
												value={subField.state.value}
											/>
											{field.state.value.length > 1 && (
												<Button
													className="border-white/5 bg-[#141414] hover:bg-white/5"
													onClick={() => field.removeValue(i)}
													size="icon"
													type="button"
													variant="outline"
												>
													<XIcon />
												</Button>
											)}
										</div>
									)}
								</form.Field>
							))}
							<Button
								className="w-full border-white/5 bg-transparent text-[#A1A1A1] hover:bg-white/5"
								onClick={() => field.pushValue("")}
								size="sm"
								type="button"
								variant="outline"
							>
								+ Add Goal
							</Button>
						</div>
					)}
				</form.Field>
			</div>

			<Button
				className="mt-4 h-11 w-full rounded-lg bg-[#2546BE] font-medium text-white transition-colors hover:bg-[#2546BE]/90"
				disabled={disabled}
				onClick={() =>
					toast.promise(form.handleSubmit(), {
						loading: "Validating...",
						success: "Ready",
						error: (error) =>
							error instanceof Error ? error.message : "Validation failed",
					})
				}
			>
				{props.submitLabel}
			</Button>
		</div>
	);
}
