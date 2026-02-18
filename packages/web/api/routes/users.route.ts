import { and, desc, eq, isNull } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { safeAsync } from "@/lib/utils/safe";
import { db } from "../lib/db";
import { schema, views } from "../lib/db/schema";
import { ApiError } from "../lib/utils/hono/error";
import { respond } from "../lib/utils/hono/respond";
import { validator, zHexAddress } from "../lib/utils/zod";
import { requireAuth } from "../middleware/auth";

const { users } = schema;
const { activeUsers } = views;

const usersRoute = new Hono()
	.use(requireAuth)
	.get(
		"/",
		validator(
			"query",
			z.object({
				page: z.coerce.number().default(1),
				limit: z.coerce.number().default(5),
			}),
		),
		async (c) => {
			const { page, limit } = c.req.valid("query");
			const offset = (page - 1) * limit;
			const [data, error] = await safeAsync(
				db
					.select()
					.from(activeUsers)
					.orderBy(desc(activeUsers.createdAt))
					.limit(limit)
					.offset(offset),
			);

			if (error) throw new ApiError(500, error.message, { error });
			if (data.length === 0) throw new ApiError(404, "No users found");
			return respond.ok(c, 200, "Users fetched successfully", {
				page,
				limit,
				users: data,
			});
		},
	)
	.get(
		"/:address",
		validator("param", z.object({ address: zHexAddress() })),
		async (c) => {
			const { address } = c.req.valid("param");
			const [data, error] = await safeAsync(
				db.select().from(activeUsers).where(eq(activeUsers.address, address)),
			);

			if (error) throw new ApiError(500, error.message, { error });
			if (!data[0]) throw new ApiError(404, "User not found");
			return respond.ok(c, 200, "User fetched successfully", { user: data[0] });
		},
	)
	.post(
		"/",
		validator(
			"json",
			z.object({
				name: z
					.string()
					.min(1, "Minimum 1 character required")
					.max(32, "Maximum 32 characters required"),
				address: zHexAddress(),
			}),
		),
		async (c) => {
			const { name, address } = c.req.valid("json");
			const [data, error] = await safeAsync(
				db.insert(users).values({ address, name }).returning(),
			);

			if (error) throw new ApiError(500, error.message, { error });
			return respond.ok(c, 201, "User created successfully", { user: data[0] });
		},
	)
	.delete(
		"/:address",
		validator("param", z.object({ address: zHexAddress() })),
		async (c) => {
			const { address } = c.req.valid("param");
			const [data, error] = await safeAsync(
				db
					.update(users)
					.set({ deletedAt: new Date().toISOString() })
					.where(and(eq(users.address, address), isNull(users.deletedAt)))
					.returning(),
			);

			if (error) throw new ApiError(500, error.message, { error });
			if (!data[0]) throw new ApiError(404, "User not found");
			return respond.ok(c, 200, "User deleted successfully", { user: data[0] });
		},
	);
export default usersRoute;
export type UsersType = typeof usersRoute;
