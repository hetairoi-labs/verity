import type { VerifyAccessTokenResponse } from "@privy-io/node";
import { createMiddleware } from "hono/factory";
import { ApiError } from "../utils/hono/error";
import { privy } from "../utils/privy";

export const requireAuth = createMiddleware<{
	Variables: {
		user: VerifyAccessTokenResponse;
	};
}>(async (c, next) => {
	const authHeader = c.req.header("Authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		throw new ApiError(401, "Unauthorized", {
			reason: "Invalid authorization header",
		});
	}
	const token = authHeader.split(" ")[1];
	if (!token) {
		throw new ApiError(401, "Unauthorized", {
			reason: "No token provided",
		});
	}

	const verifiedClaims = await privy.utils().auth().verifyAccessToken(token);
	c.set("user", verifiedClaims);
	await next();
});
