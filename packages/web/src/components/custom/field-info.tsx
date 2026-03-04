import type { AnyFieldApi } from "@tanstack/react-form";

export function FieldInfo({ field }: { field: AnyFieldApi }) {
	return (
		<div className="text-destructive-foreground text-xs">
			{field.state.meta.isTouched && !field.state.meta.isValid ? (
				<p>
					{field.state.meta.errors
						?.map((err) => (typeof err === "string" ? err : err.message))
						.join(", ")}
				</p>
			) : null}
			{field.state.meta.isValidating ? <p>Validating...</p> : null}
		</div>
	);
}
