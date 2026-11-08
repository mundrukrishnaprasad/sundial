import { neon } from "@neondatabase/serverless";
import type { SqlClient } from "../lib/db";
import { requireEnv } from "../lib/env";
import { SCHEMA_SQL } from "../lib/schema";
import { seedDemoData } from "../lib/seed";

async function main() {
  const sql = neon(requireEnv("DATABASE_URL")) as SqlClient;

  const tables = ["audit_log", "timesheet_entries", "timesheets", "projects", "users"];
  for (const table of tables) {
    await sql.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
  }

  for (const statement of SCHEMA_SQL) {
    await sql.query(statement);
  }

  await seedDemoData(sql);

  const users = (await sql`SELECT count(*)::int AS count FROM users`) as { count: number }[];
  const timesheets = (await sql`SELECT count(*)::int AS count FROM timesheets`) as {
    count: number;
  }[];

  console.log("Sundial database reset.");
  console.log(`Users: ${users[0]?.count ?? 0}`);
  console.log(`Timesheets: ${timesheets[0]?.count ?? 0}`);
  console.log("Demo password: Sundial!2026");
}

main().catch((error) => {
  console.error("Reset failed:", error);
  process.exitCode = 1;
});
