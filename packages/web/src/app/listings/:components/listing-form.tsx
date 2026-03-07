import { XIcon } from "@phosphor-icons/react";
import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import type { ListingFormInput } from "@/src/lib/hooks/actions/use-session-actions";
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
	defaultValues?: Partial<{
		description: string;
		email: string;
		goals: string[];
		price: string;
		title: string;
		topic: string;
	}>;
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
	const form = useForm({
		defaultValues: {
			title: props.defaultValues?.title ?? "",
			email: props.defaultValues?.email ?? "",
			topic: props.defaultValues?.topic ?? "",
			description: props.defaultValues?.description ?? "",
			price: props.defaultValues?.price ?? "1",
			goals: props.defaultValues?.goals ?? [""],
		} satisfies ListingFormValues,
		onSubmit: async ({ value }) => {
			validateValues(value);
			await props.onSubmit(mapFormToListing(value));
		},
	});

	const isSubmitting = useStore(form.store, (state) => state.isSubmitting);
	const disabled = props.isPending || isSubmitting;

	return (
		<div className="space-y-3">
			<form.Field name="title">
				{(field) => (
					<div className="space-y-1">
						<Label htmlFor={field.name}>Title</Label>
						<Input
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
					<div className="space-y-1">
						<Label htmlFor={field.name}>Email</Label>
						<Input
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
					<div className="space-y-1">
						<Label htmlFor={field.name}>Topic</Label>
						<Input
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
					<div className="space-y-1">
						<Label htmlFor={field.name}>Description</Label>
						<Input
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
					<div className="space-y-1">
						<Label htmlFor={field.name}>Price (USDC)</Label>
						<Input
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
				<Label>Goals</Label>
				<form.Field mode="array" name="goals">
					{(field) => (
						<div className="space-y-2">
							{field.state.value.map((_, i) => (
								<form.Field key={`goal-${i}`} name={`goals[${i}]`}>
									{(subField) => (
										<div className="flex gap-2">
											<Input
												onBlur={subField.handleBlur}
												onChange={(e) => subField.handleChange(e.target.value)}
												placeholder={`Goal ${i + 1}`}
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
									)}
								</form.Field>
							))}
							<Button
								className="w-full"
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
				className="w-full"
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
