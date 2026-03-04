import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Card, CardContent } from "@/src/components/ui/card";
import { profile } from "./mock";

export default function ProfileBanner() {
	return (
		<Card className="h-full overflow-hidden p-0">
			<div className="relative">
				<div className="h-32 w-full rounded-t-xl bg-muted" />

				<div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
					<Avatar className="size-20 ring-4 ring-card">
						<AvatarFallback className="bg-secondary font-medium text-2xl">
							{profile.name
								.split(" ")
								.map((n) => n[0])
								.join("")}
						</AvatarFallback>
					</Avatar>
				</div>
			</div>

			<CardContent className="pt-14 pb-5 text-center">
				<h3 className="text-foreground text-xl">{profile.name}</h3>
				<p className="mt-0.5 text-muted-foreground text-sm">{profile.role}</p>

				<div className="mt-5 flex items-center justify-center gap-8">
					{profile.stats.map((stat) => (
						<div className="text-center" key={stat.label}>
							<p className="font-medium text-foreground text-lg">
								{stat.value}
							</p>
							<p className="text-muted-foreground text-xs">{stat.label}</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
