import { useMutation } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import { safeAsync } from "@/lib/utils/safe";
import { client } from "../../utils/hc";
import { pinata } from "../../utils/pinata";
import { usePrivyToken } from "../web3/use-privy-token";

type CreateJsonPresignedUrlRoute =
	(typeof client.uploads)["presigned-json"]["$post"];
type CreateJsonPresignedUrlInput =
	InferRequestType<CreateJsonPresignedUrlRoute>["json"];

export type UploadPayload = Record<string, unknown> | unknown[];
export interface UploadToPinataInput {
	json: UploadPayload;
	presign?: CreateJsonPresignedUrlInput;
}

export function useUploadToPinataMutation() {
	const token = usePrivyToken();

	return useMutation({
		mutationFn: async ({ json, presign }: UploadToPinataInput) => {
			if (!token) {
				throw new Error("No auth token");
			}

			const signedResponse = await parseResponse(
				client.uploads["presigned-json"].$post(
					{ json: presign || {} },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
			);
			const signed = signedResponse.data;

			if (!signed?.signedUrl) {
				throw new Error("Missing signed upload URL");
			}

			const [upload, uploadError] = await safeAsync(
				async () => await pinata.upload.public.json(json).url(signed.signedUrl)
			);

			if (uploadError) {
				throw new Error(
					`Failed to upload JSON to Pinata: ${uploadError.message}`
				);
			}

			return upload;
		},
	});
}
