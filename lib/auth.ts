import { redirect } from "next/navigation";
import { readSession, type Role, type SessionUser } from "./session";

export async function requireUser(): Promise<SessionUser> {
  const user = await readSession();
  if (!user) redirect("/login");
  return user;
}

export function canManage(role: Role): boolean {
  return role === "manager" || role === "admin";
}

export function canAdmin(role: Role): boolean {
  return role === "admin";
}
