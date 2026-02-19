import { useState } from "react";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useApi } from "@/src/lib/hooks/api/use-api";

export function GetBot() {
	const [botId, setBotId] = useState<string | undefined>();
	const api = useApi();
	const { data } = api.meet.getBot({ botId: botId ?? "" });

	return (
		<TestCard
			title="Get Bot"
			description="Retrieve bot by ID"
			data={data ? JSON.stringify(data, null, 2) : null}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const id = (e.target as HTMLFormElement).botId.value.trim();
					id && setBotId(id);
				}}
				className="flex flex-col gap-4"
			>
				<Input type="text" placeholder="Enter bot ID" name="botId" required />
				<Button className="w-full" type="submit">
					Fetch Bot
				</Button>
			</form>
		</TestCard>
	);
}
