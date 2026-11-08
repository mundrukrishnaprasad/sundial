import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { requireEnv } from "./env";

export type Role = "employee" | "manager" | "admin";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

const COOKIE_NAME = "sundial_session";
const MAX_AGE = 60 * 60 * 24 * 7;

function secretKey(): Uint8Array {
  return new TextEncoder().encode(requireEnv("AUTH_SECRET"));
}

export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function readSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (
      !payload.sub ||
      typeof payload.email !== "string" ||
      typeof payload.name !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    const role = payload.role as Role;
    if (!["employee", "manager", "admin"].includes(role)) return null;

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role,
    };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
