import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "@/api/lib/db";
import { schema, views } from "@/api/lib/db/schema";
import { ApiError } from "@/api/lib/utils/hono/error";
import { respond } from "@/api/lib/utils/hono/respond";
import { validator } from "@/api/lib/utils/zod";
import { safeAsync } from "@/lib/utils/safe";

const _courses = schema.courses;
const activeCourses = views.activeCourses;

const courseRoute = new Hono()
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
				db.select().from(activeCourses).limit(limit).offset(offset),
			);
			if (error) throw new ApiError(500, error.message, { error });
			if (data.length === 0) throw new ApiError(404, "No courses found");
			return respond.ok(c, 200, "Courses fetched successfully", {
				page,
				limit,
				courses: data,
			});
		},
	)
	.get(
		"/:id",
		validator("param", z.object({ id: z.coerce.number() })),
		async (c) => {
			const { id } = c.req.valid("param");
			const [data, error] = await safeAsync(
				db.select().from(activeCourses).where(eq(activeCourses.id, id)),
			);
			if (error) throw new ApiError(500, error.message, { error });
			if (!data[0]) throw new ApiError(404, "Course not found");
			return respond.ok(c, 200, `Course ${id} fetched successfully`, {
				course: data[0],
			});
		},
	);

export default courseRoute;
export type CourseType = typeof courseRoute;
