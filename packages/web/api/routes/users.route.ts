import { Hono } from "hono";
import { requireAuth } from "@/api/lib/middleware/auth";
import { respond } from "@/api/lib/utils/hono/respond";
import { validator } from "@/api/lib/utils/zod";
import {
	createUser,
	createUserInputSchema,
	deleteUser,
	getUser,
} from "../handlers/users";

const usersRoute = new Hono()
	.use(requireAuth)
	.get("/", async (c) => {
		const user = await getUser({ userId: c.var.user.user_id });
		return respond.ok(c, 200, "User fetched successfully", { user });
	})
	.post("/", validator("json", createUserInputSchema), async (c) => {
		const user = await createUser(c.var.user.user_id, c.req.valid("json"));
		if (!user) {
			return respond.ok(c, 200, "User already exists", { exists: true });
		}
		return respond.ok(c, 201, "User created successfully", { user });
	})
	.delete("/", async (c) => {
		const user = await deleteUser({ userId: c.var.user.user_id });
		return respond.ok(c, 200, "User deleted successfully", { user });
	});

export default usersRoute;
export type UsersType = typeof usersRoute;
