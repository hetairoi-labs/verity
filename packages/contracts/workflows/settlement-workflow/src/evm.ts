import {
	bytesToHex,
	cre,
	getNetwork,
	hexToBase64,
	type Runtime,
} from "@chainlink/cre-sdk";
import type { zConfig } from "@verity/workflows-shared/zod";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import type z from "zod";

// type SessionDetails = z.infer<ReturnType<typeof zSessionDetails>>;

export function settleSession(
	runtime: Runtime<z.infer<ReturnType<typeof zConfig>>>,
	sessionId: bigint,
	decision: { score: number; confidence: number },
	decisionCid: string,
): string {
	const evmCfg = runtime.config.evms[0];
	const pinataGatewayUrl = runtime
		.getSecret({ id: "PINATA_GATEWAY_URL" })
		.result();

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

	const score = decision.score / 100; //transpate bps;
	const confidence = decision.confidence / 100; //transpate bps;
	const reportData = encodeEvaluationReport(
		BigInt(sessionId),
		confidence,
		score,
		pinataGatewayUrl.value,
		decisionCid,
	);

	const reportResponse = runtime
		.report({
			encodedPayload: hexToBase64(reportData),
			encoderName: "evm",
			signingAlgo: "ecdsa",
			hashingAlgo: "keccak256",
		})
		.result();

	const writeReportResult = evmClient
		.writeReport(runtime, {
			receiver: evmCfg.sessionRegistryAddress,
			report: reportResponse,
			gasConfig: {
				gasLimit: runtime.config.evms[0].gasLimit,
			},
		})
		.result();

	runtime.log("Waiting for write report response");
	const txHash = bytesToHex(writeReportResult.txHash ?? new Uint8Array(32));
	runtime.log(`Write report transaction succeeded: ${txHash}`);

	return txHash;
}

const encodeEvaluationReport = (
	sessionId: bigint,
	confidenceBps: number,
	learningBps: number,
	pinataGatewayUrl: string,
	responseId: string,
) =>
	encodeAbiParameters(
		parseAbiParameters(
			"uint256 id, uint16 confidenceBps, uint16 learningBps, string evidenceUri",
		),
		[
			sessionId,
			confidenceBps,
			learningBps,
			evidenceUri(pinataGatewayUrl, responseId),
		],
	);

const evidenceUri = (pinataGatewayUrl: string, responseId: string) =>
	`${pinataGatewayUrl.replace(/\/$/, "")}/ipfs/${responseId}`;
