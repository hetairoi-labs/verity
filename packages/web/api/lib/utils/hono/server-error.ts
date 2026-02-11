import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type {
	ClientErrorStatusCode,
	ServerErrorStatusCode,
} from "hono/utils/http-status";
import type { JSONObject } from "hono/utils/types";
import { type HeaderRecord, respond } from "./respond";

export class ApiError<T extends JSONObject = JSONObject> extends HTTPException {
	public readonly data?: T;
	public readonly headers?: HeaderRecord;

	constructor(
		status: ClientErrorStatusCode | ServerErrorStatusCode = 500,
		message: string,
		data?: T,
		headers?: HeaderRecord,
	) {
		super(status, { message, cause: data });
		this.data = data;
		this.headers = headers;
	}
}

export function handleError(err: Error | HTTPException, c: Context) {
	const status =
		err instanceof HTTPException
			? (err.status as ClientErrorStatusCode | ServerErrorStatusCode)
			: 500;

	const headers = err instanceof ApiError ? err.headers : undefined;
	const errorBody = err instanceof ApiError ? err.data : err.cause;

	console.error(`[Error]: ${err.message}`);
	console.log("Error Details:", errorBody);
	return respond.err(c, status, err.message, errorBody, headers);
}
