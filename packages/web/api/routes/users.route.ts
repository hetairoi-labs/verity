import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../lib/db";
import { schema, views } from "../lib/db/schema";
import { ApiError } from "../lib/utils/hono/error";
import { respond } from "../lib/utils/hono/respond";
import { safeQuery } from "../lib/utils/safe";
import { validator, zHexAddress } from "../lib/utils/zod";
import { requireAuth } from "../middleware/auth";

const { users, linkedAccounts } = schema;
const { activeUsers } = views;

const usersRoute = new Hono()
	.use(requireAuth)
	.get("/", async (c) => {
		const userId = c.var.user.user_id;
		const user = await safeQuery(
			db.select().from(activeUsers).where(eq(activeUsers.id, userId)),
		);
		if (user.length === 0) throw new ApiError(404, "User not found");
		return respond.ok(c, 200, "User fetched successfully", { user: user[0] });
	})
	.post(
		"/",
		validator(
			"json",
			z.object({
				name: z
					.string()
					.min(1, "Minimum 1 character required")
					.max(32, "Maximum 32 characters required")
					.optional(),
				address: zHexAddress(),
				method: z.string().min(1, "Minimum 1 character required"),
			}),
		),
		async (c) => {
			const { name, address, method } = c.req.valid("json");
			const userId = c.var.user.user_id;

			const user = await safeQuery(
				db.insert(users).values({ id: userId, name }).returning(),
			);

			const linkedAccount = await safeQuery(
				db
					.insert(linkedAccounts)
					.values({ address, userId, method })
					.returning(),
			);

			return respond.ok(c, 201, "User created successfully", {
				user: {
					user: user[0],
					linkedAccount: linkedAccount[0],
				},
			});
		},
	);
export default usersRoute;
export type UsersType = typeof usersRoute;
