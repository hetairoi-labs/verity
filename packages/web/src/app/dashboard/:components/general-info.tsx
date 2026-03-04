import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { generalInfo } from "./mock";

export default function GeneralInfo() {
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="text-lg">General Information</CardTitle>
			</CardHeader>

			<CardContent className="space-y-5">
				<p className="text-muted-foreground text-sm leading-relaxed">
					{generalInfo.bio}
				</p>

				<div className="grid grid-cols-2 gap-3">
					{generalInfo.fields.map((field) => (
						<div
							className="space-y-0.5 rounded-2xl bg-secondary/50 px-4 py-3"
							key={field.label}
						>
							<p className="text-muted-foreground text-xs">{field.label}</p>
							<p className="font-medium text-foreground text-sm">
								{field.value}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
