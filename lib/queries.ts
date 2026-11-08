import { db } from "./db";
import type { Role } from "./session";
import { roundHours, summarizeHours, type HoursSummary } from "./utilization";

export type TimesheetStatus = "draft" | "submitted" | "approved" | "rejected";

export type Timesheet = {
  id: string;
  user_id: string;
  week_start: string;
  status: TimesheetStatus;
  submitted_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_at: string;
  updated_at: string;
};

export type TimesheetEntry = {
  id: string;
  timesheet_id: string;
  project_id: string;
  project_name: string;
  project_code: string;
  project_client: string;
  billable: boolean;
  work_date: string;
  hours: string;
  note: string;
};

export type Project = {
  id: string;
  code: string;
  name: string;
  client: string;
  billable: boolean;
  active: boolean;
  created_at: string;
};

export type TeamRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  timesheet_id: string | null;
  status: TimesheetStatus | null;
  total_hours: string;
  billable_hours: string;
};

export type ApprovalRow = {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  week_start: string;
  status: TimesheetStatus;
  submitted_at: string | null;
  total_hours: string;
  billable_hours: string;
};

export type UtilizationPerson = {
  id: string;
  name: string;
  email: string;
  role: Role;
  timesheet_id: string | null;
  status: TimesheetStatus | null;
  total_hours: string;
  billable_hours: string;
};

export type UtilizationProject = {
  id: string;
  name: string;
  code: string;
  client: string;
  billable: boolean;
  total_hours: string;
};

export type UtilizationReport = {
  people: UtilizationPerson[];
  projects: UtilizationProject[];
  totals: HoursSummary;
};

export type AuditRow = {
  id: string;
  actor_name: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  detail: Record<string, unknown>;
  created_at: string;
};

export type RecentTimesheet = {
  week_start: string;
  status: TimesheetStatus;
  submitted_at: string | null;
  total_hours: string;
  billable_hours: string;
};

export async function getTimesheet(
  userId: string,
  weekStart: string,
): Promise<{ timesheet: Timesheet | null; entries: TimesheetEntry[]; summary: HoursSummary }> {
  const sql = await db();
  const rows = (await sql`
    SELECT
      id,
      user_id,
      week_start::text AS week_start,
      status,
      submitted_at,
      reviewed_by,
      reviewed_at,
      review_note,
      created_at,
      updated_at
    FROM timesheets
    WHERE user_id = ${userId} AND week_start = ${weekStart}
    LIMIT 1
  `) as unknown as Timesheet[];

  const timesheet = rows[0] ?? null;
  if (!timesheet) {
    return { timesheet: null, entries: [], summary: summarizeHours([]) };
  }

  const entries = (await sql`
    SELECT
      e.id,
      e.timesheet_id,
      e.project_id,
      p.name AS project_name,
      p.code AS project_code,
      p.client AS project_client,
      p.billable,
      e.work_date::text AS work_date,
      e.hours,
      e.note
    FROM timesheet_entries e
    JOIN projects p ON p.id = e.project_id
    WHERE e.timesheet_id = ${timesheet.id}
    ORDER BY e.work_date ASC, e.created_at ASC
  `) as unknown as TimesheetEntry[];

  return { timesheet, entries, summary: summarizeHours(entries) };
}

export async function getOrCreateTimesheet(userId: string, weekStart: string): Promise<Timesheet> {
  const sql = await db();
  const rows = (await sql`
    INSERT INTO timesheets (user_id, week_start)
    VALUES (${userId}, ${weekStart})
    ON CONFLICT (user_id, week_start) DO UPDATE SET updated_at = timesheets.updated_at
    RETURNING *
  `) as unknown as Timesheet[];
  return rows[0];
}

export async function getTimesheetById(
  id: string,
  user: { id: string; role: Role },
): Promise<{
  timesheet: Timesheet;
  entries: TimesheetEntry[];
  owner: { id: string; name: string; email: string; manager_id: string | null };
} | null> {
  const sql = await db();
  const rows = (await sql`
    SELECT
      t.id,
      t.user_id,
      t.week_start::text AS week_start,
      t.status,
      t.submitted_at,
      t.reviewed_by,
      t.reviewed_at,
      t.review_note,
      t.created_at,
      t.updated_at,
      u.name AS owner_name,
      u.email AS owner_email,
      u.manager_id
    FROM timesheets t
    JOIN users u ON u.id = t.user_id
    WHERE t.id = ${id}
    LIMIT 1
  `) as unknown as (Timesheet & {
    owner_name: string;
    owner_email: string;
    manager_id: string | null;
  })[];

  const row = rows[0];
  if (!row) return null;

  const authorized =
    user.role === "admin" ||
    row.user_id === user.id ||
    (user.role === "manager" && row.manager_id === user.id);
  if (!authorized) return null;

  const entries = (await sql`
    SELECT
      e.id,
      e.timesheet_id,
      e.project_id,
      p.name AS project_name,
      p.code AS project_code,
      p.client AS project_client,
      p.billable,
      e.work_date::text AS work_date,
      e.hours,
      e.note
    FROM timesheet_entries e
    JOIN projects p ON p.id = e.project_id
    WHERE e.timesheet_id = ${id}
    ORDER BY e.work_date ASC, e.created_at ASC
  `) as unknown as TimesheetEntry[];

  return {
    timesheet: row,
    entries,
    owner: {
      id: row.user_id,
      name: row.owner_name,
      email: row.owner_email,
      manager_id: row.manager_id,
    },
  };
}

export async function getRecentTimesheets(userId: string, limit = 6): Promise<RecentTimesheet[]> {
  const sql = await db();
  return (await sql`
    SELECT
      t.week_start::text AS week_start,
      t.status,
      t.submitted_at,
      COALESCE(SUM(e.hours), 0)::text AS total_hours,
      COALESCE(SUM(CASE WHEN p.billable THEN e.hours ELSE 0 END), 0)::text AS billable_hours
    FROM timesheets t
    LEFT JOIN timesheet_entries e ON e.timesheet_id = t.id
    LEFT JOIN projects p ON p.id = e.project_id
    WHERE t.user_id = ${userId}
    GROUP BY t.id, t.week_start, t.status, t.submitted_at
    ORDER BY t.week_start DESC
    LIMIT ${limit}
  `) as unknown as RecentTimesheet[];
}

export async function getProjects(): Promise<Project[]> {
  const sql = await db();
  return (await sql`
    SELECT * FROM projects
    ORDER BY active DESC, name ASC
  `) as unknown as Project[];
}

export async function getActiveProjects(): Promise<Project[]> {
  const sql = await db();
  return (await sql`
    SELECT * FROM projects
    WHERE active = true
    ORDER BY name ASC
  `) as unknown as Project[];
}

export async function getApprovals(user: { id: string; role: Role }): Promise<ApprovalRow[]> {
  const sql = await db();

  if (user.role === "admin") {
    return (await sql`
      SELECT
        t.id,
        t.user_id,
        u.name AS user_name,
        u.email AS user_email,
        t.week_start::text AS week_start,
        t.status,
        t.submitted_at,
        COALESCE(SUM(e.hours), 0)::text AS total_hours,
        COALESCE(SUM(CASE WHEN p.billable THEN e.hours ELSE 0 END), 0)::text AS billable_hours
      FROM timesheets t
      JOIN users u ON u.id = t.user_id
      LEFT JOIN timesheet_entries e ON e.timesheet_id = t.id
      LEFT JOIN projects p ON p.id = e.project_id
      WHERE t.status = 'submitted'
      GROUP BY t.id, u.name, u.email
      ORDER BY t.submitted_at ASC NULLS LAST
    `) as unknown as ApprovalRow[];
  }

  return (await sql`
    SELECT
      t.id,
      t.user_id,
      u.name AS user_name,
      u.email AS user_email,
      t.week_start::text AS week_start,
      t.status,
      t.submitted_at,
      COALESCE(SUM(e.hours), 0)::text AS total_hours,
      COALESCE(SUM(CASE WHEN p.billable THEN e.hours ELSE 0 END), 0)::text AS billable_hours
    FROM timesheets t
    JOIN users u ON u.id = t.user_id
    LEFT JOIN timesheet_entries e ON e.timesheet_id = t.id
    LEFT JOIN projects p ON p.id = e.project_id
    WHERE t.status = 'submitted' AND u.manager_id = ${user.id}
    GROUP BY t.id, u.name, u.email
    ORDER BY t.submitted_at ASC NULLS LAST
  `) as unknown as ApprovalRow[];
}

export async function getPendingApprovalCount(user: { id: string; role: Role }): Promise<number> {
  const sql = await db();
  const rows = (
    user.role === "admin"
      ? await sql`SELECT count(*)::int AS count FROM timesheets WHERE status = 'submitted'`
      : await sql`
          SELECT count(*)::int AS count
          FROM timesheets t
          JOIN users u ON u.id = t.user_id
          WHERE t.status = 'submitted' AND u.manager_id = ${user.id}
        `
  ) as { count: number }[];
  return Number(rows[0]?.count ?? 0);
}

export async function getTeamOverview(
  user: { id: string; role: Role },
  weekStart: string,
): Promise<TeamRow[]> {
  const sql = await db();

  if (user.role === "admin") {
    return (await sql`
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        t.id AS timesheet_id,
        t.status,
        COALESCE(SUM(e.hours), 0)::text AS total_hours,
        COALESCE(SUM(CASE WHEN p.billable THEN e.hours ELSE 0 END), 0)::text AS billable_hours
      FROM users u
      LEFT JOIN timesheets t ON t.user_id = u.id AND t.week_start = ${weekStart}
      LEFT JOIN timesheet_entries e ON e.timesheet_id = t.id
      LEFT JOIN projects p ON p.id = e.project_id
      WHERE u.role IN ('employee', 'manager')
      GROUP BY u.id, u.name, u.email, u.role, t.id, t.status
      ORDER BY u.name ASC
    `) as unknown as TeamRow[];
  }

  return (await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      t.id AS timesheet_id,
      t.status,
      COALESCE(SUM(e.hours), 0)::text AS total_hours,
      COALESCE(SUM(CASE WHEN p.billable THEN e.hours ELSE 0 END), 0)::text AS billable_hours
    FROM users u
    LEFT JOIN timesheets t ON t.user_id = u.id AND t.week_start = ${weekStart}
    LEFT JOIN timesheet_entries e ON e.timesheet_id = t.id
    LEFT JOIN projects p ON p.id = e.project_id
    WHERE u.manager_id = ${user.id}
    GROUP BY u.id, u.name, u.email, u.role, t.id, t.status
    ORDER BY u.name ASC
  `) as unknown as TeamRow[];
}

export async function getUtilizationReport(weekStart: string): Promise<UtilizationReport> {
  const sql = await db();

  const people = (await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      u.role,
      t.id AS timesheet_id,
      t.status,
      COALESCE(SUM(e.hours), 0)::text AS total_hours,
      COALESCE(SUM(CASE WHEN p.billable THEN e.hours ELSE 0 END), 0)::text AS billable_hours
    FROM users u
    LEFT JOIN timesheets t
      ON t.user_id = u.id
      AND t.week_start = ${weekStart}
      AND t.status IN ('submitted', 'approved')
    LEFT JOIN timesheet_entries e ON e.timesheet_id = t.id
    LEFT JOIN projects p ON p.id = e.project_id
    WHERE u.role IN ('employee', 'manager')
    GROUP BY u.id, u.name, u.email, u.role, t.id, t.status
    ORDER BY u.name ASC
  `) as unknown as UtilizationPerson[];

  const projects = (await sql`
    SELECT
      p.id,
      p.name,
      p.code,
      p.client,
      p.billable,
      COALESCE((
        SELECT SUM(e.hours)
        FROM timesheet_entries e
        JOIN timesheets t ON t.id = e.timesheet_id
        WHERE e.project_id = p.id
          AND t.week_start = ${weekStart}
          AND t.status IN ('submitted', 'approved')
      ), 0)::text AS total_hours
    FROM projects p
    WHERE p.active = true
    ORDER BY total_hours DESC, p.name ASC
  `) as unknown as UtilizationProject[];

  const total = people.reduce((sum, person) => sum + Number(person.total_hours), 0);
  const billable = people.reduce((sum, person) => sum + Number(person.billable_hours), 0);

  return {
    people,
    projects,
    totals: {
      total: roundHours(total),
      billable: roundHours(billable),
      nonBillable: roundHours(total - billable),
      utilization: total > 0 ? Math.round((billable / total) * 100) : 0,
    },
  };
}

export async function getAuditLog(limit = 100): Promise<AuditRow[]> {
  const sql = await db();
  return (await sql`
    SELECT
      a.id,
      u.name AS actor_name,
      a.action,
      a.entity,
      a.entity_id,
      a.detail,
      a.created_at
    FROM audit_log a
    LEFT JOIN users u ON u.id = a.actor_id
    ORDER BY a.created_at DESC
    LIMIT ${limit}
  `) as unknown as AuditRow[];
}
