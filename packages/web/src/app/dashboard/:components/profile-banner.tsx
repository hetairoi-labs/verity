import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Card, CardContent } from "@/src/components/ui/card";
import { profile } from "./mock";

export default function ProfileBanner() {
	return (
		<Card className="overflow-hidden p-0 h-full">
			<div className="relative">
				<div className="h-32 w-full bg-muted rounded-t-xl" />

				<div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
					<Avatar className="size-20 ring-4 ring-card">
						<AvatarFallback className="bg-secondary text-2xl font-medium">
							{profile.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
				</div>
			</div>

			<CardContent className="pt-14 pb-5 text-center">
				<h3 className="text-xl text-foreground">{profile.name}</h3>
				<p className="mt-0.5 text-sm text-muted-foreground">{profile.role}</p>

				<div className="mt-5 flex items-center justify-center gap-8">
					{profile.stats.map((stat) => (
						<div key={stat.label} className="text-center">
							<p className="text-lg font-medium text-foreground">
								{stat.value}
							</p>
							<p className="text-xs text-muted-foreground">{stat.label}</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
