import type { Context } from "hono";
import type { ResponseHeader } from "hono/utils/headers";
import type {
	ClientErrorStatusCode,
	ServerErrorStatusCode,
	SuccessStatusCode,
} from "hono/utils/http-status";
import type { BaseMime } from "hono/utils/mime";
import type { JSONObject } from "hono/utils/types";

export const respond = {
	ok: <C extends Context, T extends JSONObject, U extends SuccessStatusCode>(
		ctx: C,
		status: U = 200 as U,
		message: string,
		data: T,
		headers?: HeaderRecord,
	) => {
		ctx.status(status);
		for (const [name, value] of Object.entries(headers || {})) {
			ctx.header(name, value);
		}
		return ctx.json({ success: true, message, data });
	},

	err: <
		C extends Context,
		U extends ClientErrorStatusCode | ServerErrorStatusCode,
		T extends JSONObject,
	>(
		ctx: C,
		status: U = 500 as U,
		message: string,
		error?: T,
		headers?: HeaderRecord,
	) => {
		ctx.status(status);
		for (const [name, value] of Object.entries(headers || {})) {
			ctx.header(name, value);
		}
		return ctx.json({ success: false, message, error });
	},
};

export type HeaderRecord =
	| Record<"Content-Type", BaseMime>
	| Record<ResponseHeader, string>
	| Record<string, string>;
