import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import type {
	ClientErrorStatusCode,
	ServerErrorStatusCode,
} from "hono/utils/http-status";
import type { JSONObject } from "hono/utils/types";
import { ZodError, z } from "zod";
import { logger } from "../pino";
import { type HeaderRecord, respond } from "./respond";

export class ApiError<T extends JSONObject = JSONObject> extends HTTPException {
	readonly data?: T;
	readonly headers?: HeaderRecord;

	constructor(
		status: ClientErrorStatusCode | ServerErrorStatusCode,
		message: string,
		data?: T,
		headers?: HeaderRecord
	) {
		super(status, { message, cause: data });
		this.data = data;
		this.headers = headers;
	}
}

export function handleError(err: Error | HTTPException, c: Context) {
	let status: ClientErrorStatusCode | ServerErrorStatusCode = 500;
	let headers: HeaderRecord | undefined;
	let errorBody: unknown;

	if (err instanceof HTTPException) {
		status = err.status as ClientErrorStatusCode | ServerErrorStatusCode;
		headers = err instanceof ApiError ? err.headers : undefined;
		errorBody = err instanceof ApiError ? err.data : err.cause;
	} else if (err instanceof ZodError) {
		status = 400;
		errorBody = {
			summary: z.prettifyError(err),
			details: z.flattenError(err).fieldErrors,
		};
	} else {
		errorBody = err.cause;
	}
	const requestLogger = c.get("logger") ?? logger;

	requestLogger.error(
		{
			status,
			message: err.message,
			errorBody,
		},
		"http.error"
	);

	return respond.err(c, status, err.message, errorBody as JSONObject, headers);
}
