import { footerLinks } from "./mock";

export default function Footer() {
	return (
		<footer className="flex items-center justify-between py-6 text-muted-foreground text-sm">
			<p>
				© 2022 Horizon UI. All Rights Reserved. Made with love by{" "}
				<span className="font-medium text-foreground">ishtails</span>
			</p>

			<div className="flex items-center gap-6">
				{footerLinks.map((link) => (
					<a
						className="transition-colors hover:text-foreground"
						href={link.href}
						key={link.label}
					>
						{link.label}
					</a>
				))}
			</div>
		</footer>
	);
}
