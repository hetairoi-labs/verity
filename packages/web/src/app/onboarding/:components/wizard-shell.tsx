import { StarFourIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { Panel } from "@/src/app/dashboard/:components/panel";

export function WizardShell({
	children,
	description,
	title,
}: {
	children: ReactNode;
	description: string;
	title: string;
}) {
	return (
		<div className="dark min-h-dvh bg-background p-3 text-foreground md:p-4">
			<div className="mx-auto flex min-h-[92dvh] max-w-4xl items-center justify-center">
				<Panel className="w-full max-w-xl">
					<div className="mb-5 flex items-center gap-2">
						<span className="grid size-8 place-items-center rounded-full bg-secondary">
							<StarFourIcon size={16} weight="fill" />
						</span>
						<p className="text-2xl">Verity</p>
					</div>
					<h1 className="text-2xl">{title}</h1>
					<p className="mt-1 text-muted-foreground text-sm">{description}</p>
					<div className="mt-6">{children}</div>
				</Panel>
			</div>
		</div>
	);
}
