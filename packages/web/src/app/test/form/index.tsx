import { useForm, useStore } from "@tanstack/react-form";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";
import { FieldInfo } from "@/src/components/custom/field-info";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

const userSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	age: z.number().min(13, "You must be 13 to make an account"),
	country: z.string().min(1, "Country is required"),
	city: z.string().min(1, "City is required"),
});

function FormIndex() {
	const form = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			age: 0,
			country: "",
			city: "",
		},
		validators: {
			onChange: userSchema,
		},
		onSubmit: async ({ value }) => {
			toast.promise(
				new Promise((resolve) => {
					setTimeout(() => {
						resolve(value);
					}, 1000);
				}).then((data) => {
					console.log("Submitted form data:", data);
				}),
				{
					loading: "Submitting...",
					success: "Form has been submitted",
					error: "Form has been errored",
				},
			);
		},
	});

	const canSubmit = useStore(form.store, (state) => state.canSubmit);
	const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

	return (
		<div className="flex flex-col items-center justify-center h-screen p-8">
			<Card>
				<CardHeader>
					<CardTitle>Tanstack Form</CardTitle>
					<CardDescription>
						A simple form built with Tanstack Form.
					</CardDescription>
				</CardHeader>

				<CardContent className="flex flex-col gap-4">
					<div className="flex gap-4">
						<form.Field
							name="firstName"
							children={(field) => (
								<div className="flex flex-col gap-2">
									<Label htmlFor={field.name} className="text-muted-foreground">
										First Name
									</Label>

									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										placeholder="First Name"
										onChange={(e) => field.handleChange(e.target.value)}
									/>

									<FieldInfo field={field} />
								</div>
							)}
						/>
						<form.Field
							name="lastName"
							children={(field) => (
								<div className="flex flex-col gap-2">
									<Label htmlFor={field.name} className="text-muted-foreground">
										Last Name
									</Label>

									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										placeholder="Last Name"
										onChange={(e) => field.handleChange(e.target.value)}
									/>

									<FieldInfo field={field} />
								</div>
							)}
						/>
					</div>
					<div>
						<form.Field
							name="age"
							children={(field) => (
								<div className="flex flex-col gap-2">
									<Label htmlFor={field.name} className="text-muted-foreground">
										Age
									</Label>

									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										placeholder="Age"
										type="number"
										onChange={(e) => field.handleChange(Number(e.target.value))}
									/>

									<FieldInfo field={field} />
								</div>
							)}
						/>
					</div>
					<div className="flex gap-4">
						<form.Field
							name="country"
							listeners={{
								onChange: () => form.setFieldValue("city", ""),
							}}
							children={(field) => (
								<div className="flex flex-col gap-2">
									<Label htmlFor={field.name} className="text-muted-foreground">
										Country
									</Label>

									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										placeholder="Country"
										onChange={(e) => field.handleChange(e.target.value)}
									/>

									<FieldInfo field={field} />
								</div>
							)}
						/>
						<form.Field
							name="city"
							children={(field) => (
								<div className="flex flex-col gap-2">
									<Label htmlFor={field.name} className="text-muted-foreground">
										City
									</Label>

									<Input
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										placeholder="City"
										onChange={(e) => field.handleChange(e.target.value)}
									/>

									<FieldInfo field={field} />
								</div>
							)}
						/>
					</div>
				</CardContent>

				<CardFooter className="justify-end gap-2">
					<CardAction>
						<Button variant="outline" onClick={() => form.reset()} className="">
							Reset
						</Button>
					</CardAction>

					<CardAction>
						<Button
							onClick={() => form.handleSubmit()}
							disabled={!canSubmit || isSubmitting}
						>
							Submit
						</Button>
					</CardAction>
				</CardFooter>
			</Card>
		</div>
	);
}

export const Route = createFileRoute("/test/form/")({
	component: FormIndex,
});
