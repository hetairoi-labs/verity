import ThemeSwitch from "@/src/components/custom/theme-switch";
import { cn } from "@/src/lib/utils/index";

export default function Layout({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className="bg-background">
			<div className={cn("@container/main", className)}>{children}</div>

			<div className="fixed right-4 bottom-4">
				<ThemeSwitch />
			</div>
		</div>
	);
}
