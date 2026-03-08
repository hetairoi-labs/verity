import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useResolveMeetingIndexMutation } from "@/src/lib/hooks/api/use-meetings-api";

interface ResolveMeetingIndexModalProps {
	meetingId: number;
	onOpenChange: (open: boolean) => void;
	open: boolean;
}

export function ResolveMeetingIndexModal({
	meetingId,
	open,
	onOpenChange,
}: ResolveMeetingIndexModalProps) {
	const [txHash, setTxHash] = useState("");
	const resolveMeetingIndex = useResolveMeetingIndexMutation();

	const disabled =
		resolveMeetingIndex.isPending ||
		txHash.trim().length === 0 ||
		!txHash.trim().startsWith("0x");

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Attach CRE Registration Tx</DialogTitle>
					<DialogDescription>
						Paste the CRE initiation tx hash. We will parse `SessionRegistered`
						and store the meeting index for this meeting.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-2 py-2">
					<Label htmlFor="cre-registration-txhash">CRE tx hash</Label>
					<Input
						id="cre-registration-txhash"
						onChange={(event) => setTxHash(event.target.value)}
						placeholder="0x..."
						value={txHash}
					/>
				</div>
				<DialogFooter showCloseButton>
					<Button
						disabled={disabled}
						onClick={async () => {
							await resolveMeetingIndex.mutateAsync({
								meetingId,
								txHash: txHash.trim() as `0x${string}`,
							});
							onOpenChange(false);
						}}
					>
						{resolveMeetingIndex.isPending ? "Resolving..." : "Resolve Meeting"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
