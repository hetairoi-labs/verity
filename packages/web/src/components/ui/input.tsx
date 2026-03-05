import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

import { cn } from "@/src/lib/utils/index";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<InputPrimitive
			className={cn(
				"h-9 w-full min-w-0 rounded-lg border border-border/70 bg-background/60 px-3 py-1.5 text-base outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted/60 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
				className
			)}
			data-slot="input"
			type={type}
			{...props}
		/>
	);
}

export { Input };
