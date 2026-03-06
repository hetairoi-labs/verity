import {
	type Account,
	type Chain,
	type Client,
	getContract,
	type Transport,
} from "viem";
import { definitions } from "./definitions.gen";

export function getContracts(
	networkName: keyof typeof definitions,
	client: Client<Transport, Chain, Account>,
) {
	if (!definitions[networkName]) {
		throw new Error(
			`No contract definitions found for network: ${networkName}`,
		);
	}

	const Manager = getContract({
		...definitions[networkName].KXManager,
		client,
	});

	const SessionRegistry = getContract({
		...definitions[networkName].KXSessionRegistry,
		client,
	});

	const USDC = getContract({
		...definitions[networkName].USDC,
		client,
	});

	return {
		Manager,
		SessionRegistry,
		USDC,
	};
}

export * from "./definitions.gen";
export * from "./workflows/shared/src/zod";
