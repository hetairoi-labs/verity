import { XIcon } from "@phosphor-icons/react";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

export function TopicsField({
	inputValue,
	onAdd,
	onInputChange,
	onRemove,
	topics,
}: {
	inputValue: string;
	onAdd: () => void;
	onInputChange: (value: string) => void;
	onRemove: (topic: string) => void;
	topics: string[];
}) {
	return (
		<div className="space-y-2">
			<Label htmlFor="topics-input">Topics</Label>
			<Input
				id="topics-input"
				onChange={(e) => onInputChange(e.target.value)}
				onKeyDown={(event) => {
					if (event.key !== "Enter") {
						return;
					}
					event.preventDefault();
					onAdd();
				}}
				placeholder="Type a topic and press Enter"
				value={inputValue}
			/>

			<div className="mt-1 flex min-h-7 flex-wrap gap-2">
				{topics.map((topic) => (
					<Badge className="gap-1 pr-1" key={topic} variant="secondary">
						{topic}
						<button
							aria-label={`Remove ${topic}`}
							className="cursor-pointer rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
							onClick={() => onRemove(topic)}
							type="button"
						>
							<XIcon size={12} />
						</button>
					</Badge>
				))}
			</div>
		</div>
	);
}
