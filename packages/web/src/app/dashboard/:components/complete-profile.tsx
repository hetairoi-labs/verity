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
		<Card className="flex h-full flex-col">
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
						<UploadSimpleIcon className="text-foreground" size={24} />
					</div>
					<h4 className="font-medium text-foreground text-sm">Upload Files</h4>
					<p className="text-muted-foreground text-xs">
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
