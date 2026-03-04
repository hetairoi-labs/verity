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
		onSubmit: ({ value }) => {
			return toast.promise(
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
				}
			);
		},
	});

	const canSubmit = useStore(form.store, (state) => state.canSubmit);
	const isSubmitting = useStore(form.store, (state) => state.isSubmitting);

	return (
		<div className="flex h-screen flex-col items-center justify-center p-8">
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
							children={(field) => (
								<div className="flex flex-col gap-2">
									<Label className="text-muted-foreground" htmlFor={field.name}>
										First Name
									</Label>

									<Input
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="First Name"
										value={field.state.value}
									/>

									<FieldInfo field={field} />
								</div>
							)}
							name="firstName"
						/>
						<form.Field
							children={(field) => (
								<div className="flex flex-col gap-2">
									<Label className="text-muted-foreground" htmlFor={field.name}>
										Last Name
									</Label>

									<Input
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Last Name"
										value={field.state.value}
									/>

									<FieldInfo field={field} />
								</div>
							)}
							name="lastName"
						/>
					</div>
					<div>
						<form.Field
							children={(field) => (
								<div className="flex flex-col gap-2">
									<Label className="text-muted-foreground" htmlFor={field.name}>
										Age
									</Label>

									<Input
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										placeholder="Age"
										type="number"
										value={field.state.value}
									/>

									<FieldInfo field={field} />
								</div>
							)}
							name="age"
						/>
					</div>
					<div className="flex gap-4">
						<form.Field
							children={(field) => (
								<div className="flex flex-col gap-2">
									<Label className="text-muted-foreground" htmlFor={field.name}>
										Country
									</Label>

									<Input
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Country"
										value={field.state.value}
									/>

									<FieldInfo field={field} />
								</div>
							)}
							listeners={{
								onChange: () => form.setFieldValue("city", ""),
							}}
							name="country"
						/>
						<form.Field
							children={(field) => (
								<div className="flex flex-col gap-2">
									<Label className="text-muted-foreground" htmlFor={field.name}>
										City
									</Label>

									<Input
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="City"
										value={field.state.value}
									/>

									<FieldInfo field={field} />
								</div>
							)}
							name="city"
						/>
					</div>
				</CardContent>

				<CardFooter className="justify-end gap-2">
					<CardAction>
						<Button className="" onClick={() => form.reset()} variant="outline">
							Reset
						</Button>
					</CardAction>

					<CardAction>
						<Button
							disabled={!canSubmit || isSubmitting}
							onClick={() => form.handleSubmit()}
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
