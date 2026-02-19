import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
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
	children?: ReactNode;
	data?: string | null;
	className?: string;
	error?: string | null;
}

export function TestCard({
	title,
	description,
	children,
	data,
	className,
	error,
}: TestCardProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		if (!data) return;

		try {
			await navigator.clipboard.writeText(data);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

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
						<div className="flex items-center justify-between mb-2">
							<h3 className="text-sm font-medium">Response:</h3>
							<Button
								onClick={handleCopy}
								size="icon"
								variant="ghost"
								className="h-6 w-6"
								title={copied ? "Copied!" : "Copy to clipboard"}
							>
								{copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
							</Button>
						</div>

						{error && error.length > 0 ? (
							<pre className="text-xs bg-accent p-2 font-mono overflow-x-auto max-h-48">
								{error}
							</pre>
						) : (
							<pre className="text-xs bg-accent p-2 font-mono overflow-x-auto max-h-48">
								{data}
							</pre>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
