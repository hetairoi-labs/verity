import { GitBranchIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";

export default function CompleteProfile() {
	return (
		<Card className="flex flex-col h-full">
			<CardHeader>
				<CardTitle className="text-lg">Complete your profile</CardTitle>
				<CardDescription>
					Stay on the pulse of distributed projects with an anline whiteboard to
					plan, coordinate and discuss
				</CardDescription>
			</CardHeader>

			<CardContent className="flex flex-1 flex-col gap-4">
				<div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-secondary/60 py-5">
					<div className="flex size-12 items-center justify-center rounded-full bg-secondary">
						<UploadSimpleIcon size={24} className="text-foreground" />
					</div>
					<h4 className="text-sm font-medium text-foreground">Upload Files</h4>
					<p className="text-xs text-muted-foreground">
						PNG, JPG and GIF files are allowed
					</p>
				</div>

				<Button className="w-fit">
					<GitBranchIcon size={16} />
					Publish now
				</Button>
			</CardContent>
		</Card>
	);
}
