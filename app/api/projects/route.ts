import { apiError, getApiUser, guardMutation, json } from "@/lib/api";
import { recordAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { getActiveProjects, getProjects } from "@/lib/queries";
import { projectSchema } from "@/lib/validation";

export async function GET() {
  const user = await getApiUser();
  if (!user) return apiError("Not authenticated.", 401);

  const projects = user.role === "employee" ? await getActiveProjects() : await getProjects();
  return json({ projects });
}

export async function POST(request: Request) {
  const originError = guardMutation(request);
  if (originError) return originError;

  const user = await getApiUser();
  if (!user) return apiError("Not authenticated.", 401);
  if (user.role !== "admin") return apiError("Only admins can create projects.", 403);

  const body = await request.json().catch(() => null);
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Check the project details.", 400, parsed.error.flatten());
  }

  const sql = await db();
  try {
    const rows = (await sql`
      INSERT INTO projects (code, name, client, billable)
      VALUES (${parsed.data.code}, ${parsed.data.name}, ${parsed.data.client}, ${parsed.data.billable})
      RETURNING *
    `) as unknown as { id: string }[];

    await recordAudit({
      actorId: user.id,
      action: "project.create",
      entity: "project",
      entityId: rows[0].id,
      detail: { code: parsed.data.code, name: parsed.data.name },
    });

    return json({ project: rows[0] }, 201);
  } catch (error) {
    const code = (error as { code?: string }).code;
    if (code === "23505") return apiError("A project with this code already exists.", 409);
    throw error;
  }
}
