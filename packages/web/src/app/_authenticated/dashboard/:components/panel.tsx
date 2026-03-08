import { cn } from "@/src/lib/utils";

export function Panel({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<section
			className={cn(
				"rounded-2xl border border-border/70 bg-card p-6",
				className
			)}
		>
			{children}
		</section>
	);
}
