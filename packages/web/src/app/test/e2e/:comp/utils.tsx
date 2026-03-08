export function ReadDiv({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<>
			<p className="font-mono text-sm uppercase">{title}:</p>
			<div className="flex flex-col gap-2 overflow-scroll rounded bg-background p-4">
				{children}
			</div>
		</>
	);
}
