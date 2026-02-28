import {
	bytesToHex,
	cre,
	type EVMLog,
	getNetwork,
	Runner,
	type Runtime,
} from "@chainlink/cre-sdk";
import { createRecallBot } from "@verity/workflows-shared/recall";
import { readFromStore, writeToStore } from "@verity/workflows-shared/store";
import { zConfig, zHex } from "@verity/workflows-shared/zod";
import { decodeEventLog, keccak256, parseAbi, toHex } from "viem";
import z from "zod";
import { initiateSession } from "./src/evm";

type Config = z.infer<ReturnType<typeof zConfig>>;

const eventAbi = parseAbi([
	"event SessionRegistrationRequested(address indexed teacher, address indexed learner, uint256 amount, string partialDataCID)",
]);
const eventSignature =
	"SessionRegistrationRequested(address,address,uint256,string)";
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

		if (decodedLog.eventName !== "SessionRegistrationRequested")
			throw new Error("Unexpected event");

		const { teacher, learner, amount, partialDataCID } = decodedLog.args;

		runtime.log(
			`Session registration request detected for teacher: ${teacher}, learner: ${learner}, amount: ${amount}, partialDataCID: ${partialDataCID}`,
		);

		const unpublishedSession = readFromStore(
			runtime,
			"unpublishedSessionData",
			partialDataCID,
		);

		const { transcriptId } = createRecallBot(
			runtime,
			unpublishedSession.meetingUrl,
		);

		const session = writeToStore(runtime, "sessionData", transcriptId, {
			...unpublishedSession,
			transcriptId,
		});

		const network = getNetwork({
			chainFamily: "evm",
			chainSelectorName: evmCfg.chainSelectorName,
			isTestnet: true,
		});
		if (!network)
			throw new Error(`Unknown chain name: ${evmCfg.chainSelectorName}`);

		const txHash: string = initiateSession(runtime, {
			teacher,
			learner,
			amount,
			dataCid: session.data.cid,
		});
		runtime.log(`Initiation tx hash: ${txHash}`);

		return "Initiation Request Processed";
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
