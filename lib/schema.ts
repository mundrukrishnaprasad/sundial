export const SCHEMA_SQL: string[] = [
  `CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    name text NOT NULL,
    role text NOT NULL CHECK (role IN ('employee', 'manager', 'admin')),
    manager_id uuid REFERENCES users(id) ON DELETE SET NULL,
    password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL UNIQUE,
    name text NOT NULL,
    client text NOT NULL,
    billable boolean NOT NULL DEFAULT true,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS timesheets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    week_start date NOT NULL,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
    submitted_at timestamptz,
    reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at timestamptz,
    review_note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (user_id, week_start)
  )`,
  `CREATE TABLE IF NOT EXISTS timesheet_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    timesheet_id uuid NOT NULL REFERENCES timesheets(id) ON DELETE CASCADE,
    project_id uuid NOT NULL REFERENCES projects(id) ON DELETE RESTRICT,
    work_date date NOT NULL,
    hours numeric(4, 2) NOT NULL CHECK (hours > 0 AND hours <= 24),
    note text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS timesheet_entries_timesheet_idx ON timesheet_entries(timesheet_id)`,
  `CREATE INDEX IF NOT EXISTS timesheets_user_week_idx ON timesheets(user_id, week_start)`,
  `CREATE TABLE IF NOT EXISTS audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id uuid REFERENCES users(id) ON DELETE SET NULL,
    action text NOT NULL,
    entity text NOT NULL,
    entity_id text,
    detail jsonb NOT NULL DEFAULT '{}'::jsonb,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS audit_log_created_idx ON audit_log(created_at DESC)`,
];
