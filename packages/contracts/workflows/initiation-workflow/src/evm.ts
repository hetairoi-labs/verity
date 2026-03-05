import {
	bytesToHex,
	cre,
	encodeCallMsg,
	getNetwork,
	hexToBase64,
	LAST_FINALIZED_BLOCK_NUMBER,
	type Runtime,
} from "@chainlink/cre-sdk";
import type { zConfig } from "@verity/workflows-shared/zod";
import {
	type Address,
	decodeFunctionResult,
	encodeAbiParameters,
	encodeFunctionData,
	getAddress,
	parseAbiParameters,
	zeroAddress,
} from "viem";
import type z from "zod";
import { definitions } from "../../../definitions.gen";

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

const Abi = definitions.test.KXManager.abi;

export function getListingByIndex(
	runtime: Runtime<z.infer<ReturnType<typeof zConfig>>>,
	args: {
		listingIndex: bigint;
	},
): { teacher: Address; price: bigint; dataCID: string } {
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
	const callData = encodeFunctionData({
		abi: Abi,
		functionName: "listings",
		args: [BigInt(args.listingIndex)],
	});

	const contractCall = evmClient
		.callContract(runtime, {
			call: encodeCallMsg({
				from: zeroAddress,
				to: getAddress(evmCfg.managerAddress),
				data: callData,
			}),
			blockNumber: LAST_FINALIZED_BLOCK_NUMBER,
		})
		.result();

	const [teacher, price, dataCID] = decodeFunctionResult({
		abi: Abi,
		functionName: "listings",
		data: bytesToHex(contractCall.data),
	});

	return { teacher, price, dataCID };
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
