import { type Client, getContract } from "viem";
import { definitions } from "./definitions.gen";

export function getContracts(
	networkName: keyof typeof definitions,
	client: Client,
) {
	if (!definitions[networkName]) {
		throw new Error(
			`No contract definitions found for network: ${String(networkName)}`,
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
