import { PinataSDK } from "pinata";

const LEADING_SLASHES_REGEX = /^\/+/;

export function toGatewayUrl(cid: string, path?: string) {
	const normalizedPath = path?.replace(LEADING_SLASHES_REGEX, "");
	return `https://${process.env.PUBLIC_PINATA_GATEWAY_URL}/ipfs/${cid}${normalizedPath ? `/${normalizedPath}` : ""}`;
}

export const pinata = new PinataSDK({
	pinataGateway: process.env.PUBLIC_PINATA_GATEWAY_URL,
});
