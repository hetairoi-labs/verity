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
	children?: ReactNode;
	className?: string;
	data?: string | null;
	description?: string;
	error?: string | null;
	title: string;
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
		if (!data) {
			return;
		}

		try {
			await navigator.clipboard.writeText(data);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error("Failed to copy text: ", err);
		}
	};

	return (
		<Card className={`mb-4 w-full max-w-md shadow-none ${className || ""}`}>
			<CardHeader>
				<CardTitle className="font-semibold text-xl">{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="space-y-4">
				{children}
				{data && (
					<div className="mt-4">
						<div className="mb-2 flex items-center justify-between">
							<h3 className="font-medium text-sm">Response:</h3>
							<Button
								className="h-6 w-6"
								onClick={handleCopy}
								size="icon"
								title={copied ? "Copied!" : "Copy to clipboard"}
								variant="ghost"
							>
								{copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
							</Button>
						</div>

						{error && error.length > 0 ? (
							<pre className="max-h-48 overflow-x-auto bg-accent p-2 font-mono text-xs">
								{error}
							</pre>
						) : (
							<pre className="max-h-48 overflow-x-auto bg-accent p-2 font-mono text-xs">
								{data}
							</pre>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
