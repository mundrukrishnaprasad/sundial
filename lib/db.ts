import { neon } from "@neondatabase/serverless";
import { requireEnv } from "./env";
import { SCHEMA_SQL } from "./schema";
import { seedDemoData } from "./seed";

export type SqlClient = ReturnType<typeof neon>;

let client: SqlClient | null = null;
let ready: Promise<void> | null = null;

function getClient(): SqlClient {
  if (!client) {
    client = neon(requireEnv("DATABASE_URL"));
  }
  return client;
}

async function bootstrap(): Promise<void> {
  const sql = getClient();

  for (const statement of SCHEMA_SQL) {
    await sql.query(statement);
  }

  const rows = (await sql`SELECT count(*)::int AS count FROM users`) as { count: number }[];
  if (Number(rows[0]?.count ?? 0) === 0) {
    await seedDemoData(sql);
  }
}

export async function db(): Promise<SqlClient> {
  if (!ready) {
    ready = bootstrap().catch((error: unknown) => {
      ready = null;
      throw error;
    });
  }
  await ready;
  return getClient();
}
