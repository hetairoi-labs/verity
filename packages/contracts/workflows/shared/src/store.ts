import {
	consensusIdenticalAggregation,
	cre,
	type HTTPSendRequester,
	ok,
	type Runtime,
} from "@chainlink/cre-sdk";
import type z from "zod";
import { type zConfig, zStoreKeySchemas, zWriteToStoreResponse } from "./zod";

type StoreKey = keyof ReturnType<typeof zStoreKeySchemas>;
type Config = z.infer<ReturnType<typeof zConfig>>;
type WriteToStoreResponse = z.infer<ReturnType<typeof zWriteToStoreResponse>>;
type ReadStoreValue<T extends StoreKey> = z.infer<
	ReturnType<typeof zStoreKeySchemas>[T]
>;

export function writeToStore<T extends StoreKey>(
	runtime: Runtime<Config>,
	key: T,
	id: string,
	value: z.infer<ReturnType<typeof zStoreKeySchemas>[T]>,
): WriteToStoreResponse {
	const pinataApiJwt = runtime.getSecret({ id: "PINATA_API_JWT" }).result();

	const httpClient = new cre.capabilities.HTTPClient();

	const writeResult = httpClient
		.sendRequest(
			runtime,
			// bhaai jagah chod do

			(sendRequester: HTTPSendRequester, _config: Config) => {
				const formData = new FormData();
				const file = new File(
					[JSON.stringify(zStoreKeySchemas()[key].parse(value))],
					`${key}:${id}.json`,
					{
						type: "application/json",
					},
				);

				formData.append("file", file);
				formData.append("network", "public");
				formData.append("name", `${key}:${id}.json`);
				formData.append(
					"keyvalues",
					JSON.stringify({
						keyvalues: {
							env: "prod",
						},
					}),
				);

				const bodyBytes = new TextEncoder().encode(JSON.stringify(formData));
				const body = Buffer.from(bodyBytes).toString("base64");

				const req: Parameters<typeof sendRequester.sendRequest>[0] = {
					url: "https://uploads.pinata.cloud/v3/files",
					method: "POST",
					body: body,
					headers: {
						Authorization: `Bearer ${pinataApiJwt.value}`,
						"Content-Type": "application/json",
					},
					cacheSettings: {
						store: true,
						maxAge: "60s",
					},
				};

				const resp = sendRequester.sendRequest(req).result();
				if (!ok(resp))
					throw new Error(
						`HTTP request failed with status: ${resp.statusCode}`,
					);

				const bodyText = new TextDecoder().decode(resp.body);
				const externalResp = JSON.parse(bodyText);

				return zWriteToStoreResponse().parse(externalResp);
			},

			// Bhai yaha thodi aur jagah chodd do
			// yaha bhi
			consensusIdenticalAggregation<WriteToStoreResponse>(),
		)(runtime.config)
		.result();

	return writeResult;
}

export function readFromStore<T extends StoreKey>(
	runtime: Runtime<Config>,
	key: T,
	cid: string,
): ReadStoreValue<T> {
	const httpClient = new cre.capabilities.HTTPClient();

	const readResult = httpClient
		.sendRequest(
			runtime,
			(sendRequester: HTTPSendRequester, _config: Config) => {
				const req: Parameters<typeof sendRequester.sendRequest>[0] = {
					url: `https://${cid}.ipfs.w3s.link/`,
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
					cacheSettings: {
						store: true,
						maxAge: "3600s", // 1 hour cache
					},
				};

				const resp = sendRequester.sendRequest(req).result();
				if (!ok(resp))
					throw new Error(
						`HTTP request failed with status: ${resp.statusCode}`,
					);

				const bodyText = new TextDecoder().decode(resp.body);
				const parsedData = JSON.parse(bodyText);

				return zStoreKeySchemas()[key].parse(parsedData);
			},
			// @ts-expect-error cre k dikkt h
			consensusIdenticalAggregation<ReadStoreValue<T>>(),
		)(runtime.config)
		.result();
	runtime.log("makichut");

	return zStoreKeySchemas()[key].parse(readResult) as ReadStoreValue<T>;
}
