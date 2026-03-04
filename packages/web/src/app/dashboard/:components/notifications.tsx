import { DotsThreeIcon } from "@phosphor-icons/react";
import { Button } from "@/src/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/src/components/ui/card";
import { Switch } from "@/src/components/ui/switch";
import { notifications as notificationItems } from "./mock";

export default function Notifications() {
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="text-lg">Notifications</CardTitle>
				<CardAction>
					<Button size="icon" variant="ghost">
						<DotsThreeIcon size={20} weight="bold" />
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent className="space-y-3">
				{notificationItems.map((item) => (
					<div
						className="flex items-center justify-between gap-3"
						key={item.id}
					>
						<Switch defaultChecked={item.enabled} />
						<span className="flex-1 text-foreground text-sm">{item.label}</span>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
