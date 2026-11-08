import { addDays, currentWeekStart, parseDateOnly, toDateOnly } from "./dates";
import { hashPassword } from "./password";
import type { SqlClient } from "./db";

const DEMO_PASSWORD = "Sundial!2026";

type SeedEntry = {
  day: number;
  code: string;
  hours: number;
  note: string;
};

const RAVI_PLAN: SeedEntry[] = [
  { day: 0, code: "NW-DISC", hours: 6, note: "Discovery interviews" },
  { day: 0, code: "INT-OPS", hours: 2, note: "Team standup and planning" },
  { day: 1, code: "NW-DEL", hours: 7, note: "API implementation" },
  { day: 1, code: "INT-OPS", hours: 1, note: "Code review" },
  { day: 2, code: "NW-DEL", hours: 8, note: "Integration testing" },
  { day: 3, code: "ATL-PLAT", hours: 6, note: "Data model and migrations" },
  { day: 3, code: "INT-OPS", hours: 2, note: "Mentoring session" },
  { day: 4, code: "ATL-PLAT", hours: 8, note: "Dashboard delivery" },
];

const SITA_PLAN: SeedEntry[] = [
  { day: 0, code: "ATL-PLAT", hours: 7, note: "Workflow design" },
  { day: 0, code: "INT-OPS", hours: 1, note: "Sprint planning" },
  { day: 1, code: "NW-DISC", hours: 8, note: "Stakeholder workshops" },
  { day: 2, code: "NW-DEL", hours: 6, note: "Frontend implementation" },
  { day: 2, code: "INT-OPS", hours: 2, note: "Design review" },
  { day: 3, code: "NW-DEL", hours: 8, note: "Accessibility pass" },
  { day: 4, code: "ATL-PLAT", hours: 4, note: "QA and fixes" },
  { day: 4, code: "INT-OPS", hours: 4, note: "Documentation" },
];

async function insertUser(
  sql: SqlClient,
  input: {
    email: string;
    name: string;
    role: string;
    managerId: string | null;
    passwordHash: string;
  },
): Promise<string> {
  const rows = (await sql`
    INSERT INTO users (email, name, role, manager_id, password_hash)
    VALUES (${input.email}, ${input.name}, ${input.role}, ${input.managerId}, ${input.passwordHash})
    RETURNING id
  `) as { id: string }[];
  return rows[0].id;
}

async function insertTimesheet(
  sql: SqlClient,
  input: {
    userId: string;
    weekStart: string;
    status: string;
    reviewerId: string | null;
    reviewNote: string | null;
  },
): Promise<string> {
  const submittedAt = input.status === "draft" ? null : new Date().toISOString();
  const reviewedAt =
    input.status === "approved" || input.status === "rejected" ? new Date().toISOString() : null;

  const rows = (await sql`
    INSERT INTO timesheets (user_id, week_start, status, submitted_at, reviewed_by, reviewed_at, review_note)
    VALUES (${input.userId}, ${input.weekStart}, ${input.status}, ${submittedAt}, ${input.reviewerId}, ${reviewedAt}, ${input.reviewNote})
    ON CONFLICT (user_id, week_start) DO UPDATE SET
      status = EXCLUDED.status,
      submitted_at = EXCLUDED.submitted_at,
      reviewed_by = EXCLUDED.reviewed_by,
      reviewed_at = EXCLUDED.reviewed_at,
      review_note = EXCLUDED.review_note
    RETURNING id
  `) as { id: string }[];
  return rows[0].id;
}

async function insertEntries(
  sql: SqlClient,
  timesheetId: string,
  weekStart: string,
  projectByCode: Map<string, string>,
  plan: SeedEntry[],
): Promise<void> {
  const start = parseDateOnly(weekStart);
  if (!start) return;

  for (const item of plan) {
    const projectId = projectByCode.get(item.code);
    if (!projectId) continue;
    const workDate = toDateOnly(addDays(start, item.day));
    await sql`
      INSERT INTO timesheet_entries (timesheet_id, project_id, work_date, hours, note)
      VALUES (${timesheetId}, ${projectId}, ${workDate}, ${item.hours}, ${item.note})
    `;
  }
}

export async function seedDemoData(sql: SqlClient): Promise<void> {
  const passwordHash = await hashPassword(DEMO_PASSWORD);

  const adminId = await insertUser(sql, {
    email: "admin@sundial.app",
    name: "Maya Rao",
    role: "admin",
    managerId: null,
    passwordHash,
  });

  const managerId = await insertUser(sql, {
    email: "manager@sundial.app",
    name: "Arjun Mehta",
    role: "manager",
    managerId: adminId,
    passwordHash,
  });

  const raviId = await insertUser(sql, {
    email: "ravi@sundial.app",
    name: "Ravi Kumar",
    role: "employee",
    managerId,
    passwordHash,
  });

  const sitaId = await insertUser(sql, {
    email: "sita@sundial.app",
    name: "Sita Nair",
    role: "employee",
    managerId,
    passwordHash,
  });

  const projects = [
    { code: "NW-DISC", name: "Northwind Discovery", client: "Northwind", billable: true },
    { code: "NW-DEL", name: "Northwind Delivery", client: "Northwind", billable: true },
    { code: "ATL-PLAT", name: "Atlas Platform", client: "Atlas", billable: true },
    { code: "INT-OPS", name: "Internal Operations", client: "Sundial", billable: false },
  ];

  for (const project of projects) {
    await sql`
      INSERT INTO projects (code, name, client, billable)
      VALUES (${project.code}, ${project.name}, ${project.client}, ${project.billable})
      ON CONFLICT (code) DO NOTHING
    `;
  }

  const projectRows = (await sql`SELECT id, code FROM projects`) as { id: string; code: string }[];
  const projectByCode = new Map(projectRows.map((row) => [row.code, row.id]));

  const current = currentWeekStart();
  const currentDate = parseDateOnly(current);
  if (!currentDate) return;

  const weeks = [-3, -2, -1, 0].map((offset) => toDateOnly(addDays(currentDate, offset * 7)));

  for (const [index, week] of weeks.entries()) {
    const isCurrent = index === weeks.length - 1;
    const isRejected = index === 1;

    const raviStatus = isCurrent ? "submitted" : isRejected ? "rejected" : "approved";
    const raviTimesheetId = await insertTimesheet(sql, {
      userId: raviId,
      weekStart: week,
      status: raviStatus,
      reviewerId: isCurrent ? null : managerId,
      reviewNote: isRejected ? "Please split the Atlas Platform hours by workstream." : null,
    });
    await insertEntries(sql, raviTimesheetId, week, projectByCode, RAVI_PLAN);

    const sitaStatus = isCurrent ? "submitted" : "approved";
    const sitaTimesheetId = await insertTimesheet(sql, {
      userId: sitaId,
      weekStart: week,
      status: sitaStatus,
      reviewerId: isCurrent ? null : managerId,
      reviewNote: null,
    });
    await insertEntries(sql, sitaTimesheetId, week, projectByCode, SITA_PLAN);
  }

  await sql`
    INSERT INTO audit_log (actor_id, action, entity, entity_id, detail)
    VALUES
      (${managerId}, 'timesheet.approve', 'timesheet', NULL, ${JSON.stringify({ note: "Approved a submitted week" })}::jsonb),
      (${adminId}, 'project.create', 'project', NULL, ${JSON.stringify({ note: "Created the Atlas Platform project" })}::jsonb)
  `;
}
