import { useState } from "react";
import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { useGetBot } from "@/src/lib/hooks/api/use-api";

export function GetBot() {
	const [botId, setBotId] = useState("");
	const { data, isPending, error } = useGetBot(botId);

	return (
		<TestCard
			title="Get Bot"
			description="Retrieve bot by ID"
			data={error ? (error as Error).message : (data ?? null)}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const id = (e.target as HTMLFormElement).botId.value.trim();
					id && setBotId(id);
				}}
				className="flex flex-col gap-4"
			>
				<Input type="text" placeholder="Enter bot ID" name="botId" />
				<Button className="w-full" type="submit" disabled={isPending}>
					{isPending ? "Fetching..." : "Fetch Bot"}
				</Button>
			</form>
		</TestCard>
	);
}
