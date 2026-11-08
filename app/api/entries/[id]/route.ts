import { apiError, getApiUser, guardMutation, json } from "@/lib/api";
import { recordAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { parseDateOnly, startOfWeek, toDateOnly } from "@/lib/dates";
import { entryUpdateSchema } from "@/lib/validation";

type EntryWithTimesheet = {
  id: string;
  timesheet_id: string;
  user_id: string;
  week_start: string;
  status: string;
};

async function loadEntry(id: string): Promise<EntryWithTimesheet | null> {
  const sql = await db();
  const rows = (await sql`
    SELECT e.id, e.timesheet_id, t.user_id, t.week_start::text AS week_start, t.status
    FROM timesheet_entries e
    JOIN timesheets t ON t.id = e.timesheet_id
    WHERE e.id = ${id}
    LIMIT 1
  `) as unknown as EntryWithTimesheet[];
  return rows[0] ?? null;
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const originError = guardMutation(request);
  if (originError) return originError;

  const user = await getApiUser();
  if (!user) return apiError("Not authenticated.", 401);

  const { id } = await context.params;
  const entry = await loadEntry(id);
  if (!entry) return apiError("Entry not found.", 404);
  if (entry.user_id !== user.id) return apiError("You can only edit your own entries.", 403);
  if (entry.status === "submitted" || entry.status === "approved") {
    return apiError("This week is locked. Reopen it before editing entries.", 409);
  }

  const body = await request.json().catch(() => null);
  const parsed = entryUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Check the entry details.", 400, parsed.error.flatten());
  }

  if (parsed.data.workDate) {
    const workDate = parseDateOnly(parsed.data.workDate);
    if (!workDate) return apiError("Enter a valid work date.", 400);
    const weekStart = toDateOnly(startOfWeek(workDate));
    if (weekStart !== entry.week_start) {
      return apiError("Move the entry by deleting it and adding it in the correct week.", 400);
    }
  }

  const sql = await db();
  if (parsed.data.projectId) {
    const projectRows = (await sql`
      SELECT id FROM projects WHERE id = ${parsed.data.projectId} AND active = true LIMIT 1
    `) as { id: string }[];
    if (!projectRows[0]) return apiError("Select an active project.", 400);
  }

  if (entry.status === "rejected") {
    await sql`
      UPDATE timesheets
      SET status = 'draft', reviewed_by = NULL, reviewed_at = NULL, review_note = NULL, updated_at = now()
      WHERE id = ${entry.timesheet_id}
    `;
  }

  const rows = (await sql`
    UPDATE timesheet_entries
    SET
      work_date = COALESCE(${parsed.data.workDate ?? null}::date, work_date),
      project_id = COALESCE(${parsed.data.projectId ?? null}::uuid, project_id),
      hours = COALESCE(${parsed.data.hours ?? null}::numeric, hours),
      note = COALESCE(${parsed.data.note ?? null}::text, note),
      updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `) as unknown as { id: string }[];

  await sql`UPDATE timesheets SET updated_at = now() WHERE id = ${entry.timesheet_id}`;

  await recordAudit({
    actorId: user.id,
    action: "entry.update",
    entity: "timesheet_entry",
    entityId: id,
    detail: { week: entry.week_start },
  });

  return json({ entry: rows[0] });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const originError = guardMutation(request);
  if (originError) return originError;

  const user = await getApiUser();
  if (!user) return apiError("Not authenticated.", 401);

  const { id } = await context.params;
  const entry = await loadEntry(id);
  if (!entry) return apiError("Entry not found.", 404);
  if (entry.user_id !== user.id) return apiError("You can only delete your own entries.", 403);
  if (entry.status === "submitted" || entry.status === "approved") {
    return apiError("This week is locked. Reopen it before deleting entries.", 409);
  }

  const sql = await db();
  await sql`DELETE FROM timesheet_entries WHERE id = ${id}`;
  await sql`UPDATE timesheets SET updated_at = now() WHERE id = ${entry.timesheet_id}`;

  await recordAudit({
    actorId: user.id,
    action: "entry.delete",
    entity: "timesheet_entry",
    entityId: id,
    detail: { week: entry.week_start },
  });

  return json({ ok: true });
}
