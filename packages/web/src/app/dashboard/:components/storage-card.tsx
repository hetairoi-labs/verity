import { CloudArrowUpIcon, DotsThreeIcon } from "@phosphor-icons/react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { Progress } from "@/src/components/ui/progress";
import { storage } from "./mock";

export default function StorageCard() {
	const percentage = (storage.used / storage.total) * 100;

	return (
		<Card className="relative h-full justify-evenly">
			<CardHeader className="absolute top-4 right-4">
				<DotsThreeIcon className="text-muted-foreground" size={20} />
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="flex flex-col items-center gap-3 text-center">
					<div className="flex size-14 items-center justify-center rounded-full bg-secondary">
						<CloudArrowUpIcon className="text-foreground" size={28} />
					</div>
					<CardTitle className="text-lg">{storage.label}</CardTitle>
					<CardDescription>{storage.description}</CardDescription>
				</div>
				<div className="mt-8 flex items-center justify-between text-sm">
					<span className="font-medium text-foreground">{storage.used} Gb</span>
					<span className="text-muted-foreground">{storage.total} Gb</span>
				</div>
				<Progress value={percentage} />
			</CardContent>
		</Card>
	);
}
