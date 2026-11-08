import { apiError, getApiUser, guardMutation, json } from "@/lib/api";
import { recordAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { projectUpdateSchema } from "@/lib/validation";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const originError = guardMutation(request);
  if (originError) return originError;

  const user = await getApiUser();
  if (!user) return apiError("Not authenticated.", 401);
  if (user.role !== "admin") return apiError("Only admins can update projects.", 403);

  const body = await request.json().catch(() => null);
  const parsed = projectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Check the project details.", 400, parsed.error.flatten());
  }

  const { id } = await context.params;
  const sql = await db();

  const rows = (await sql`
    UPDATE projects
    SET
      name = COALESCE(${parsed.data.name ?? null}::text, name),
      client = COALESCE(${parsed.data.client ?? null}::text, client),
      billable = COALESCE(${parsed.data.billable ?? null}::boolean, billable),
      active = COALESCE(${parsed.data.active ?? null}::boolean, active)
    WHERE id = ${id}
    RETURNING *
  `) as unknown as { id: string }[];

  if (!rows[0]) return apiError("Project not found.", 404);

  await recordAudit({
    actorId: user.id,
    action: "project.update",
    entity: "project",
    entityId: id,
    detail: parsed.data,
  });

  return json({ project: rows[0] });
}
