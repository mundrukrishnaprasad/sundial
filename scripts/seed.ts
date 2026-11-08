import { db } from "../lib/db";

async function main() {
  const sql = await db();
  const users = (await sql`SELECT count(*)::int AS count FROM users`) as { count: number }[];
  const timesheets = (await sql`SELECT count(*)::int AS count FROM timesheets`) as {
    count: number;
  }[];

  console.log("Sundial seed complete.");
  console.log(`Users: ${users[0]?.count ?? 0}`);
  console.log(`Timesheets: ${timesheets[0]?.count ?? 0}`);
  console.log("Demo password: Sundial!2026");
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
