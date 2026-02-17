import pino from "pino";

export const logger = pino({
	level: process.env.NODE_ENV === "production" ? "info" : "debug",
	transport: {
		target: "pino-pretty",
	},
	...(process.env.NODE_ENV !== "production" && {
		transport: {
			target: "pino-pretty",
			options: {
				colorize: true,
				translateTime: true,
				ignore: "pid,hostname,service,time,reqId,path,durationMs",
				singleLine: false,
				messageFormat: "{msg}",
			},
		},
	}),
});
