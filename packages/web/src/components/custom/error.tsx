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
		<div className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
						<WarningIcon aria-label="Error warning icon" size={32} />
					</div>
					<CardTitle className="">Something went wrong</CardTitle>
					<CardDescription className="italic">
						{error.message || "An unexpected error occurred"}
					</CardDescription>
				</CardHeader>

				<CardContent>
					<div className="space-y-3">
						<Button
							className="w-full"
							onClick={() => reset()}
							size="lg"
							variant="default"
						>
							Try Again
						</Button>

						<Button
							className="w-full"
							onClick={() => window.location.reload()}
							size="lg"
							variant="secondary"
						>
							Reload Page
						</Button>
					</div>

					{process.env.NODE_ENV === "development" && (
						<details className="mt-6">
							<summary className="cursor-pointer text-muted-foreground text-sm hover:text-foreground">
								Error Details
							</summary>
							<pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-muted p-4 text-xs">
								{error.stack}
							</pre>
						</details>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
