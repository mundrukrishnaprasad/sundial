import { apiError, getApiUser, guardMutation, json } from "@/lib/api";
import { recordAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { parseDateOnly, startOfWeek, toDateOnly } from "@/lib/dates";
import { getOrCreateTimesheet } from "@/lib/queries";
import { entrySchema } from "@/lib/validation";

export async function POST(request: Request) {
  const originError = guardMutation(request);
  if (originError) return originError;

  const user = await getApiUser();
  if (!user) return apiError("Not authenticated.", 401);

  const body = await request.json().catch(() => null);
  const parsed = entrySchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Check the entry details.", 400, parsed.error.flatten());
  }

  const workDate = parseDateOnly(parsed.data.workDate);
  if (!workDate) return apiError("Enter a valid work date.", 400);

  const weekStart = toDateOnly(startOfWeek(workDate));
  const sql = await db();

  const projectRows = (await sql`
    SELECT id FROM projects WHERE id = ${parsed.data.projectId} AND active = true LIMIT 1
  `) as { id: string }[];
  if (!projectRows[0]) return apiError("Select an active project.", 400);

  const timesheet = await getOrCreateTimesheet(user.id, weekStart);
  if (timesheet.status === "submitted" || timesheet.status === "approved") {
    return apiError("This week is locked. Reopen it before adding entries.", 409);
  }

  if (timesheet.status === "rejected") {
    await sql`
      UPDATE timesheets
      SET status = 'draft', reviewed_by = NULL, reviewed_at = NULL, review_note = NULL, updated_at = now()
      WHERE id = ${timesheet.id}
    `;
  }

  const rows = (await sql`
    INSERT INTO timesheet_entries (timesheet_id, project_id, work_date, hours, note)
    VALUES (${timesheet.id}, ${parsed.data.projectId}, ${parsed.data.workDate}, ${parsed.data.hours}, ${parsed.data.note})
    RETURNING *
  `) as unknown as { id: string }[];

  await sql`UPDATE timesheets SET updated_at = now() WHERE id = ${timesheet.id}`;

  await recordAudit({
    actorId: user.id,
    action: "entry.create",
    entity: "timesheet_entry",
    entityId: rows[0].id,
    detail: { week: weekStart, hours: parsed.data.hours },
  });

  return json({ entry: rows[0], timesheetId: timesheet.id }, 201);
}
