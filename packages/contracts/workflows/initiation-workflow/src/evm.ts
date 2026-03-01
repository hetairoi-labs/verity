import {
	bytesToHex,
	cre,
	getNetwork,
	hexToBase64,
	type Runtime,
} from "@chainlink/cre-sdk";
import type { zConfig } from "@verity/workflows-shared/zod";
import { type Address, encodeAbiParameters, parseAbiParameters } from "viem";
import type z from "zod";

export function initiateSession(
	runtime: Runtime<z.infer<ReturnType<typeof zConfig>>>,
	session: {
		teacher: Address;
		learner: Address;
		amount: bigint;
		dataCid: string;
	},
): string {
	const evmCfg = runtime.config.evms[0];

	const network = getNetwork({
		chainFamily: "evm",
		chainSelectorName: evmCfg.chainSelectorName,
		isTestnet: true,
	});
	if (!network)
		throw new Error(`Unknown chain name: ${evmCfg.chainSelectorName}`);

	const evmClient = new cre.capabilities.EVMClient(
		network.chainSelector.selector,
	);

	const creationData = encodeCreationRequest(
		session.teacher,
		session.learner,
		session.amount,
		session.dataCid,
	);

	const requestResponse = runtime
		.report({
			encodedPayload: hexToBase64(creationData),
			encoderName: "evm",
			signingAlgo: "ecdsa",
			hashingAlgo: "keccak256",
		})
		.result();

	const writeSessionResult = evmClient
		.writeReport(runtime, {
			receiver: evmCfg.managerAddress,
			report: requestResponse,
			gasConfig: {
				gasLimit: runtime.config.evms[0].gasLimit,
			},
		})
		.result();

	const txHash = bytesToHex(writeSessionResult.txHash ?? new Uint8Array(32));
	runtime.log(`Write report transaction succeeded: ${txHash}`);

	return txHash;
}

const encodeCreationRequest = (
	teacher: Address,
	learner: Address,
	amount: bigint,
	dataCid: string,
) =>
	encodeAbiParameters(
		parseAbiParameters(
			"address teacher_, address learner_, uint256 amount_, string dataCID_",
		),
		[teacher, learner, amount, dataCid],
	);
