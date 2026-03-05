import { TestCard } from "@/src/components/custom/test-card";
import { Button } from "@/src/components/ui/button";
import {
	toGatewayUrl,
	useUploadToPinataMutation,
} from "@/src/lib/hooks/api/use-uploads-api";

export function UploadToPinata() {
	const upload = useUploadToPinataMutation();
	const gatewayUrl = toGatewayUrl(upload.data?.cid ?? "");

	return (
		<TestCard
			data={gatewayUrl}
			description="Upload to Pinata"
			title="Upload to Pinata"
		>
			<Button
				className="w-full"
				disabled={upload.isPending}
				onClick={() => {
					upload.mutate({ json: { test: "test" } });
				}}
			>
				{upload.isPending ? "Uploading..." : "Upload to Pinata"}
			</Button>
		</TestCard>
	);
}
