import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../lib/db";
import { schema, views } from "../lib/db/schema";
import { respond } from "../lib/utils/hono/respond";
import { safeQuery } from "../lib/utils/safe";
import { validator, zHexAddress } from "../lib/utils/zod";
import { requireAuth } from "../middleware/auth";

const { users } = schema;
const { activeUsers } = views;

const usersRoute = new Hono()
	.use(requireAuth)
	.get("/", async (c) => {
		const userId = c.var.user.user_id;
		const user = await safeQuery(
			db.select().from(activeUsers).where(eq(users.id, userId)),
		);
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
			}),
		),
		async (c) => {
			const { name, address } = c.req.valid("json");
			const privyId = c.var.user.user_id;

			const user = await safeQuery(
				db
					.insert(users)
					.values({ id: privyId, walletAddress: address, name })
					.returning(),
			);
			return respond.ok(c, 201, "User created successfully", { user: user[0] });
		},
	);
export default usersRoute;
export type UsersType = typeof usersRoute;
