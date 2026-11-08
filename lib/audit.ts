import { db } from "./db";

export async function recordAudit(input: {
  actorId: string;
  action: string;
  entity: string;
  entityId?: string | null;
  detail?: Record<string, unknown>;
}): Promise<void> {
  const sql = await db();
  await sql`
    INSERT INTO audit_log (actor_id, action, entity, entity_id, detail)
    VALUES (
      ${input.actorId},
      ${input.action},
      ${input.entity},
      ${input.entityId ?? null},
      ${JSON.stringify(input.detail ?? {})}::jsonb
    )
  `;
}
