import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import z from "zod";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { TopicsField } from "./:components/topics-field";
import { WizardShell } from "./:components/wizard-shell";

const onboardingSchema = z.object({
	name: z.string().min(1, "Name is required"),
	topics: z.array(z.string()),
});

export const Route = createFileRoute("/onboarding/")({
	component: OnboardingPage,
});

function OnboardingPage() {
	const [topicInput, setTopicInput] = useState("");

	const form = useForm({
		defaultValues: {
			name: "",
			topics: [] as string[],
		},
		validators: {
			onChange: onboardingSchema,
		},
		onSubmit: ({ value }) => {
			console.log("Onboarding form output:", value);
		},
	});

	const canSubmit = useStore(form.store, (state) => state.canSubmit);
	const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

	return (
		<WizardShell description="Let's get you started.." title="Welcome!">
			<div className="space-y-5">
				<form.Field
					children={(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name}>Name</Label>
							<Input
								id={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="Your name"
								value={field.state.value}
							/>
							{field.state.meta.isValid ? null : (
								<p className="text-destructive text-sm">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
						</div>
					)}
					name="name"
				/>

				<form.Field
					children={(field) => {
						const addTopic = () => {
							const topic = topicInput.trim();
							if (!topic || field.state.value.includes(topic)) {
								setTopicInput("");
								return;
							}
							field.handleChange([...field.state.value, topic]);
							setTopicInput("");
						};

						const removeTopic = (topic: string) => {
							field.handleChange(
								field.state.value.filter((value) => value !== topic)
							);
						};

						return (
							<TopicsField
								inputValue={topicInput}
								onAdd={addTopic}
								onInputChange={setTopicInput}
								onRemove={removeTopic}
								topics={field.state.value}
							/>
						);
					}}
					name="topics"
				/>

				<div className="flex justify-end gap-2">
					<Button
						onClick={() => {
							form.reset();
							setTopicInput("");
						}}
						variant="outline"
					>
						Reset
					</Button>
					<Button
						disabled={!canSubmit || isSubmitting}
						onClick={() => form.handleSubmit()}
					>
						{isSubmitting ? "Saving..." : "Continue"}
					</Button>
				</div>
			</div>
		</WizardShell>
	);
}
