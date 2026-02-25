import type { ComponentProps } from "react";
import { cn } from "@/src/lib/utils/index";

interface LabelProps extends ComponentProps<"label"> {}

function Label({ className, ...props }: LabelProps) {
	return (
		// biome-ignore lint: This component forwards htmlFor prop for proper label-input association
		<label
			data-slot="label"
			className={cn(
				"gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed",
				className,
			)}
			{...props}
		/>
	);
}

export { Label };
