import { WarningIcon } from "@phosphor-icons/react";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";

interface RootErrorComponentProps {
	error: Error;
	reset: () => void;
}

export function RootErrorComponent({ error, reset }: RootErrorComponentProps) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
			<Card className="max-w-md w-full">
				<CardHeader className="text-center">
					<div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
						<WarningIcon size={32} aria-label="Error warning icon" />
					</div>
					<CardTitle className="">Something went wrong</CardTitle>
					<CardDescription className="italic">
						{error.message || "An unexpected error occurred"}
					</CardDescription>
				</CardHeader>

				<CardContent>
					<div className="space-y-3">
						<Button
							onClick={() => reset()}
							variant="default"
							className="w-full"
							size="lg"
						>
							Try Again
						</Button>

						<Button
							onClick={() => window.location.reload()}
							variant="secondary"
							className="w-full"
							size="lg"
						>
							Reload Page
						</Button>
					</div>

					{process.env.NODE_ENV === "development" && (
						<details className="mt-6">
							<summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
								Error Details
							</summary>
							<pre className="mt-2 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-40">
								{error.stack}
							</pre>
						</details>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
