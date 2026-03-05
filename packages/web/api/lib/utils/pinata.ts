import { PinataSDK } from "pinata";
import { env } from "@/lib/utils/env";

export const pinata = new PinataSDK({
	pinataJwt: env.PINATA_JWT,
	pinataGateway: env.PUBLIC_PINATA_GATEWAY_URL,
});
