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
				<CardTitle className="text-lg font-bold">General Information</CardTitle>
			</CardHeader>

			<CardContent className="space-y-5">
				<p className="text-sm leading-relaxed text-muted-foreground">
					{generalInfo.bio}
				</p>

				<div className="grid grid-cols-2 gap-3">
					{generalInfo.fields.map((field) => (
						<div
							key={field.label}
							className="space-y-0.5 rounded-2xl bg-secondary/50 px-4 py-3"
						>
							<p className="text-xs text-muted-foreground">{field.label}</p>
							<p className="text-sm font-medium text-foreground">
								{field.value}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
