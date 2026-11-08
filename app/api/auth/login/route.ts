import { apiError, guardMutation, json } from "@/lib/api";
import { recordAudit } from "@/lib/audit";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSession, type Role } from "@/lib/session";
import { loginSchema } from "@/lib/validation";

type UserRow = {
  id: string;
  email: string;
  name: string;
  role: Role;
  password_hash: string;
};

export async function POST(request: Request) {
  const originError = guardMutation(request);
  if (originError) return originError;

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return apiError("Enter a valid email and password.", 400, parsed.error.flatten());
  }

  const sql = await db();
  const rows = (await sql`
    SELECT id, email, name, role, password_hash
    FROM users
    WHERE lower(email) = lower(${parsed.data.email})
    LIMIT 1
  `) as unknown as UserRow[];

  const user = rows[0];
  if (!user || !(await verifyPassword(parsed.data.password, user.password_hash))) {
    return apiError("Email or password is incorrect.", 401);
  }

  await createSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  await recordAudit({
    actorId: user.id,
    action: "auth.login",
    entity: "session",
  });

  return json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
