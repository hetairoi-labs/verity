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
			(sendRequester: HTTPSendRequester, _config: Config) => {
				const filename = `${key}:${id}.json`;
				const jsonContent = JSON.stringify(
					zStoreKeySchemas()[key].parse(value),
				);
				const boundary = "----CREFormBoundary7MA4YWxkTrZu0gW";

				const multipart = [
					`--${boundary}\r\n`,
					`Content-Disposition: form-data; name="network"\r\n`,
					`\r\n`,
					`public\r\n`,

					`--${boundary}\r\n`,
					`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`,
					`Content-Type: application/json\r\n`,
					`\r\n`,
					jsonContent,
					`\r\n`,

					`--${boundary}\r\n`,
					`Content-Disposition: form-data; name="name"\r\n`,
					`\r\n`,
					filename,
					`\r\n`,

					`--${boundary}--\r\n`,
				].join("");

				const bodyBytes = new TextEncoder().encode(multipart);
				const body = Buffer.from(bodyBytes).toString("base64");

				const req: Parameters<typeof sendRequester.sendRequest>[0] = {
					url: "https://uploads.pinata.cloud/v3/files",
					method: "POST",
					body: body,
					headers: {
						Authorization: `Bearer ${pinataApiJwt.value}`,
						"Content-Type": `multipart/form-data; boundary=${boundary}`,
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
				// v3 response: { data: { cid, ... } }
				return zWriteToStoreResponse().parse(JSON.parse(bodyText));
			},

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
	const pinataGatewayUrl = runtime
		.getSecret({ id: "PINATA_GATEWAY_URL" })
		.result();

	const httpClient = new cre.capabilities.HTTPClient();

	const readResult = httpClient
		.sendRequest(
			runtime,
			(sendRequester: HTTPSendRequester, _config: Config) => {
				const req: Parameters<typeof sendRequester.sendRequest>[0] = {
					url: `${pinataGatewayUrl.value}/ipfs/${cid}`,
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

	return zStoreKeySchemas()[key].parse(readResult) as ReadStoreValue<T>;
}
