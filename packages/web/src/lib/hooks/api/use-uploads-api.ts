import { useMutation } from "@tanstack/react-query";
import { type InferRequestType, parseResponse } from "hono/client";
import { PinataSDK } from "pinata";
import { safeAsync } from "@/lib/utils/safe";
import { client } from "../../utils/hc";
import { usePrivyToken } from "../web3/use-privy-token";

const LEADING_SLASHES_REGEX = /^\/+/;

const pinata = new PinataSDK({
	pinataGateway: process.env.PUBLIC_PINATA_GATEWAY_URL,
});

type CreateJsonPresignedUrlRoute =
	(typeof client.uploads)["presigned-json"]["$post"];
export type CreateJsonPresignedUrlInput =
	InferRequestType<CreateJsonPresignedUrlRoute>["json"];

export type JsonUploadPayload = Record<string, unknown> | unknown[];

export function toGatewayUrl(cid: string, path?: string) {
	const normalizedPath = path?.replace(LEADING_SLASHES_REGEX, "");
	return `https://${process.env.PUBLIC_PINATA_GATEWAY_URL}/ipfs/${cid}${normalizedPath ? `/${normalizedPath}` : ""}`;
}

export function useCreatePresignedUrlMutation() {
	const token = usePrivyToken();

	return useMutation({
		mutationFn: async (json: CreateJsonPresignedUrlInput) => {
			if (!token) {
				throw new Error("No auth token");
			}

			const result = await parseResponse(
				client.uploads["presigned-json"].$post(
					{ json },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
			);

			return result.data;
		},
	});
}

export interface UploadJsonToPinataInput {
	json: JsonUploadPayload;
	presign?: CreateJsonPresignedUrlInput;
}

export function useUploadToPinataMutation() {
	const createPresignedUrlMutation = useCreatePresignedUrlMutation();

	return useMutation({
		mutationFn: async ({ json, presign }: UploadJsonToPinataInput) => {
			const signed = await createPresignedUrlMutation.mutateAsync(
				presign || {}
			);

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
