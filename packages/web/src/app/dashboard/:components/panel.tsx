import { cn } from "@/src/lib/utils";

const panelClass =
	"rounded-2xl border border-border/70 bg-card/70 p-4 md:p-5 lg:p-6";

export function Panel({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <section className={cn(panelClass, className)}>{children}</section>;
}
