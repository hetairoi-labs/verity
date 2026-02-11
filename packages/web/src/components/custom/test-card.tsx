import type { ReactNode } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";

interface TestCardProps {
	title: string;
	description?: string;
	children: ReactNode;
	data?: {
		[key: string]: unknown;
	} | null;
	className?: string;
}

export function TestCard({
	title,
	description,
	children,
	data,
	className,
}: TestCardProps) {
	return (
		<Card className={`w-full shadow-none max-w-md mb-4 ${className || ""}`}>
			<CardHeader>
				<CardTitle className="text-xl font-semibold">{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="space-y-4">
				{children}
				{data && (
					<div className="mt-4">
						<h3 className="text-sm font-medium mb-2">Response:</h3>
						<pre className="text-xs bg-accent p-2 font-mono overflow-x-auto max-h-48">
							{JSON.stringify(data, null, 2)}
						</pre>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
