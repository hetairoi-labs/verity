import { Hono } from "hono";
import { requireAuth } from "@/api/lib/middleware/auth";
import { respond } from "@/api/lib/utils/hono/respond";
import { validator } from "@/api/lib/utils/zod";
import {
	createUser,
	createUserInputSchema,
	deleteUser,
	deleteUserInputSchema,
	getUser,
	getUserInputSchema,
} from "../handlers/users";

const usersRoute = new Hono()
	.use(requireAuth)
	.get("/", validator("query", getUserInputSchema), async (c) => {
		const user = await getUser(c.req.valid("query"));
		return respond.ok(c, 200, "User fetched successfully", { user });
	})
	.post("/", validator("json", createUserInputSchema), async (c) => {
		const user = await createUser(c.var.user.user_id, c.req.valid("json"));
		return respond.ok(c, 201, "User created successfully", { user });
	})
	.delete("/", validator("json", deleteUserInputSchema), async (c) => {
		const user = await deleteUser(c.req.valid("json"));
		return respond.ok(c, 200, "User deleted successfully", { user });
	});

export default usersRoute;
export type UsersType = typeof usersRoute;
