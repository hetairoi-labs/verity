import {
	bytesToHex,
	cre,
	type EVMLog,
	getNetwork,
	Runner,
	type Runtime,
} from "@chainlink/cre-sdk";
import { getRecallTranscript } from "@verity/workflows-shared/recall";
import { readFromStore, writeToStore } from "@verity/workflows-shared/store";
import { zConfig, zHex } from "@verity/workflows-shared/zod";
import { decodeEventLog, keccak256, parseAbi, toHex } from "viem";
import z from "zod";
import { askAi } from "./src/ai";
import { settleSession } from "./src/evm";

type Config = z.infer<ReturnType<typeof zConfig>>;

const eventAbi = parseAbi([
	"event EvaluationRequested(uint256 indexed sessionId, string dataCID)",
]);
const eventSignature = "EvaluationRequested(uint256,string)";
const eventHash = keccak256(toHex(eventSignature));

const onLogTrigger = (runtime: Runtime<Config>, log: EVMLog): string => {
	try {
		const topics = z
			.tuple([zHex(), zHex()])
			.parse(log.topics.map((t) => bytesToHex(t)));
		const data = bytesToHex(log.data);
		const decodedLog = decodeEventLog({ abi: eventAbi, data, topics });

		const evmCfg = runtime.config.evms[0];
		runtime.log(`Event name: ${decodedLog.eventName}`);

		if (decodedLog.eventName !== "EvaluationRequested")
			throw new Error("Unexpected event");

		const { sessionId, dataCID } = decodedLog.args;

		runtime.log(
			`Settlement request detected for sessionId: ${sessionId}, dataCID: ${dataCID}`,
		);

		const session = readFromStore(runtime, "sessionData", dataCID);

		const { raw: transcript } = getRecallTranscript(
			runtime,
			session.transcriptId,
		);

		const network = getNetwork({
			chainFamily: "evm",
			chainSelectorName: evmCfg.chainSelectorName,
			isTestnet: true,
		});
		if (!network)
			throw new Error(`Unknown chain name: ${evmCfg.chainSelectorName}`);

		runtime.log(
			`Settling Market at contract: ${evmCfg.sessionRegistryAddress} on network: ${network.chainSelector.selector}`,
		);

		runtime.log(
			`Session data retrieved from store: ${JSON.stringify(session)}`,
		);

		const settlementResult = askAi(runtime, session, transcript);

		runtime.log(
			`Successfully sent data to API. Status: ${settlementResult.statusCode}`,
		);

		const { data: decisionStored } = writeToStore(
			runtime,
			"evaluationReport",
			sessionId.toString(),
			{
				score: settlementResult.reducedScore,
				reasoning: settlementResult.evaluationContent.result
					.flatMap((res) => res.reasoning)
					.join("\n"),
				improvements: settlementResult.evaluationContent.result.flatMap(
					(res) => res.improvements,
				),
			},
		);

		runtime.log(`Evaluation report stored with CID: ${decisionStored.cid}`);

		const txHash: string = settleSession(
			runtime,
			sessionId,
			{
				confidence: settlementResult.evaluationContent.confidence,
				score: settlementResult.reducedScore,
			},
			decisionStored.cid,
		);
		runtime.log(`Settlement tx hash: ${txHash}`);

		return "Settlement Request Processed";
	} catch (err) {
		const msg = err instanceof Error ? err.message : String(err);
		runtime.log(`onLogTrigger error: ${msg}`);
		throw err;
	}
};

const initWorkflow = (config: Config) => {
	const network = getNetwork({
		chainFamily: "evm",
		chainSelectorName: config.evms[0].chainSelectorName,
		isTestnet: true,
	});

	if (!network) {
		throw new Error(
			`Network not found for chain selector name: ${config.evms[0].chainSelectorName}`,
		);
	}

	const evmClient = new cre.capabilities.EVMClient(
		network.chainSelector.selector,
	);

	// Trigger CRE only on emit of EvaluationRequested logs from the market contract
	return [
		cre.handler(
			evmClient.logTrigger({
				addresses: [config.evms[0].sessionRegistryAddress],
				topics: [{ values: [eventHash] }],
				confidence: "CONFIDENCE_LEVEL_FINALIZED",
			}),
			onLogTrigger,
		),
	];
};

export async function main() {
	const runner = await Runner.newRunner<Config>({ configSchema: zConfig() });
	await runner.run(initWorkflow);
}

main();
