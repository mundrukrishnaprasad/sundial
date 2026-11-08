import { apiError, getApiUser, guardMutation, json } from "@/lib/api";
import { recordAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { reviewSchema } from "@/lib/validation";

type ReviewRow = {
  id: string;
  user_id: string;
  week_start: string;
  status: string;
  manager_id: string | null;
};

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const originError = guardMutation(request);
  if (originError) return originError;

  const user = await getApiUser();
  if (!user) return apiError("Not authenticated.", 401);
  if (user.role !== "manager" && user.role !== "admin") {
    return apiError("Only managers and admins can review timesheets.", 403);
  }

  const body = await request.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Check the review details.", 400, parsed.error.flatten());
  }

  const { id } = await context.params;
  const sql = await db();

  const rows = (await sql`
    SELECT t.id, t.user_id, t.week_start::text AS week_start, t.status, u.manager_id
    FROM timesheets t
    JOIN users u ON u.id = t.user_id
    WHERE t.id = ${id}
    LIMIT 1
  `) as unknown as ReviewRow[];

  const timesheet = rows[0];
  if (!timesheet) return apiError("Timesheet not found.", 404);
  if (timesheet.status !== "submitted") {
    return apiError("Only submitted timesheets can be reviewed.", 409);
  }
  if (user.role === "manager" && timesheet.manager_id !== user.id) {
    return apiError("You can only review your own team.", 403);
  }

  const status = parsed.data.action === "approve" ? "approved" : "rejected";
  const note = parsed.data.note.trim() || null;

  const updated = (await sql`
    UPDATE timesheets
    SET status = ${status}, reviewed_by = ${user.id}, reviewed_at = now(), review_note = ${note}, updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `) as unknown as { id: string }[];

  await recordAudit({
    actorId: user.id,
    action: parsed.data.action === "approve" ? "timesheet.approve" : "timesheet.reject",
    entity: "timesheet",
    entityId: id,
    detail: { week: timesheet.week_start, note },
  });

  return json({ timesheet: updated[0] });
}
