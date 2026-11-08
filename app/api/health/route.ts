import { json } from "@/lib/api";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const sql = await db();
    await sql`SELECT 1`;
    return json({
      status: "ok",
      service: "sundial",
      database: "up",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return json(
      {
        status: "degraded",
        service: "sundial",
        database: "down",
        error: error instanceof Error ? error.message : "Unknown database error",
        timestamp: new Date().toISOString(),
      },
      503,
    );
  }
}
