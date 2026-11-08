import { apiError, getApiUser, guardMutation, json } from "@/lib/api";
import { recordAudit } from "@/lib/audit";
import { db } from "@/lib/db";

type TimesheetOwner = {
  id: string;
  user_id: string;
  week_start: string;
  status: string;
};

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const originError = guardMutation(request);
  if (originError) return originError;

  const user = await getApiUser();
  if (!user) return apiError("Not authenticated.", 401);

  const { id } = await context.params;
  const sql = await db();

  const rows = (await sql`
    SELECT id, user_id, week_start::text AS week_start, status FROM timesheets WHERE id = ${id} LIMIT 1
  `) as unknown as TimesheetOwner[];
  const timesheet = rows[0];
  if (!timesheet) return apiError("Timesheet not found.", 404);
  if (timesheet.user_id !== user.id) return apiError("You can only submit your own timesheet.", 403);
  if (timesheet.status !== "draft" && timesheet.status !== "rejected") {
    return apiError("This timesheet has already been submitted.", 409);
  }

  const totals = (await sql`
    SELECT
      count(*)::int AS entry_count,
      COALESCE(SUM(hours), 0)::numeric AS total_hours
    FROM timesheet_entries
    WHERE timesheet_id = ${id}
  `) as { entry_count: number; total_hours: string }[];

  if (Number(totals[0]?.entry_count ?? 0) === 0 || Number(totals[0]?.total_hours ?? 0) <= 0) {
    return apiError("Add at least one entry before submitting.", 400);
  }

  const overbooked = (await sql`
    SELECT work_date, SUM(hours)::numeric AS hours
    FROM timesheet_entries
    WHERE timesheet_id = ${id}
    GROUP BY work_date
    HAVING SUM(hours) > 24
    LIMIT 1
  `) as { work_date: string; hours: string }[];

  if (overbooked[0]) {
    return apiError("A single day cannot exceed 24 hours.", 400, overbooked[0]);
  }

  const updated = (await sql`
    UPDATE timesheets
    SET status = 'submitted', submitted_at = now(), reviewed_by = NULL, reviewed_at = NULL, review_note = NULL, updated_at = now()
    WHERE id = ${id}
    RETURNING *
  `) as unknown as { id: string }[];

  await recordAudit({
    actorId: user.id,
    action: "timesheet.submit",
    entity: "timesheet",
    entityId: id,
    detail: { week: timesheet.week_start },
  });

  return json({ timesheet: updated[0] });
}
