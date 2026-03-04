import { MoonStarsIcon, SunIcon } from "@phosphor-icons/react";
import type { VariantProps } from "class-variance-authority";
import { useTheme } from "src/lib/context/theme-provider";
import { Button, type buttonVariants } from "../ui/button";

export default function ThemeSwitch({
	className,
	variant = "ghost",
	size = "icon",
	...props
}: React.ComponentProps<typeof Button> & VariantProps<typeof buttonVariants>) {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			className={className}
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			size={size}
			variant={variant}
			{...props}
		>
			<div className="rotate-0 transition-all dark:-rotate-90">
				{theme === "dark" ? <MoonStarsIcon /> : <SunIcon />}
			</div>
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
