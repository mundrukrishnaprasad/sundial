import { NextResponse } from "next/server";
import { readSession, type Role, type SessionUser } from "./session";

export function json<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

export function apiError(message: string, status = 400, details?: unknown): NextResponse {
  return NextResponse.json({ error: message, details }, { status });
}

export async function getApiUser(): Promise<SessionUser | null> {
  return readSession();
}

export function ensureRole(user: SessionUser | null, roles: Role[]): NextResponse | null {
  if (!user) return apiError("Not authenticated.", 401);
  if (!roles.includes(user.role)) return apiError("You do not have access to this action.", 403);
  return null;
}

export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export function guardMutation(request: Request): NextResponse | null {
  if (!isSameOrigin(request)) return apiError("Invalid request origin.", 403);
  return null;
}
