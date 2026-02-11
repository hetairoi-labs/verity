import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type {
	ClientErrorStatusCode,
	ServerErrorStatusCode,
} from "hono/utils/http-status";
import type { JSONObject } from "hono/utils/types";
import { type HeaderRecord, respond } from "./respond";

export class AppError<T extends JSONObject = JSONObject> extends HTTPException {
	public readonly error?: T;
	public readonly headers?: HeaderRecord;

	constructor(
		message: string,
		status: ClientErrorStatusCode | ServerErrorStatusCode = 500,
		error?: T,
		headers?: HeaderRecord,
	) {
		super(status, { message, cause: error });
		this.error = error;
		this.headers = headers;
	}
}

export function handleError(err: Error | HTTPException, c: Context) {
	const status =
		err instanceof HTTPException
			? (err.status as ClientErrorStatusCode | ServerErrorStatusCode)
			: 500;

	const headers = err instanceof AppError ? err.headers : undefined;
	const errorBody = err instanceof AppError ? err.error : err.cause;

	console.error(`[Error]: ${err.message}`);
	console.log("Error Details:", errorBody);
	return respond.err(c, err.message, status, errorBody, headers);
}
