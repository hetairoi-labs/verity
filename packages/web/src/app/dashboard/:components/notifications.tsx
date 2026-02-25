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
					<Button variant="ghost" size="icon">
						<DotsThreeIcon size={20} weight="bold" />
					</Button>
				</CardAction>
			</CardHeader>

			<CardContent className="space-y-3">
				{notificationItems.map((item) => (
					<div
						key={item.id}
						className="flex items-center justify-between gap-3"
					>
						<Switch defaultChecked={item.enabled} />
						<span className="flex-1 text-sm text-foreground">{item.label}</span>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
