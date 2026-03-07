import { useForm, useStore } from "@tanstack/react-form";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import type { ListingFormInput } from "@/src/lib/hooks/actions/use-session-actions";

interface ListingFormValues {
	description: string;
	email: string;
	goalOne: string;
	goalThree: string;
	goalTwo: string;
	price: number;
	title: string;
	topic: string;
}

export interface ListingFormProps {
	defaultValues?: Partial<ListingFormValues>;
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
	goals: [
		{ name: value.goalOne, weight: 1 },
		{ name: value.goalTwo, weight: 1 },
		{ name: value.goalThree, weight: 1 },
	],
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
	if (value.price < 1) {
		throw new Error("Price must be at least 1");
	}
	if (
		!(value.goalOne.trim() && value.goalTwo.trim() && value.goalThree.trim())
	) {
		throw new Error("All goals are required");
	}
};

export function ListingForm(props: ListingFormProps) {
	const form = useForm({
		defaultValues: {
			title: props.defaultValues?.title ?? "",
			email: props.defaultValues?.email ?? "",
			topic: props.defaultValues?.topic ?? "",
			description: props.defaultValues?.description ?? "",
			price: props.defaultValues?.price ?? 1_000_000,
			goalOne: props.defaultValues?.goalOne ?? "",
			goalTwo: props.defaultValues?.goalTwo ?? "",
			goalThree: props.defaultValues?.goalThree ?? "",
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
						<Label htmlFor={field.name}>Price (USDC units)</Label>
						<Input
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(event) =>
								field.handleChange(Number(event.target.value || 0))
							}
							placeholder="1000000"
							type="number"
							value={String(field.state.value)}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name="goalOne">
				{(field) => (
					<div className="space-y-1">
						<Label htmlFor={field.name}>Goal 1</Label>
						<Input
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
							placeholder="Deploy a contract to Sepolia"
							value={field.state.value}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name="goalTwo">
				{(field) => (
					<div className="space-y-1">
						<Label htmlFor={field.name}>Goal 2</Label>
						<Input
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
							placeholder="Read and explain ABI output"
							value={field.state.value}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name="goalThree">
				{(field) => (
					<div className="space-y-1">
						<Label htmlFor={field.name}>Goal 3</Label>
						<Input
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(event) => field.handleChange(event.target.value)}
							placeholder="Simulate settlement outcomes"
							value={field.state.value}
						/>
					</div>
				)}
			</form.Field>

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
