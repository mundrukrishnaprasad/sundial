import { guardMutation, json } from "@/lib/api";
import { destroySession } from "@/lib/session";

export async function POST(request: Request) {
  const originError = guardMutation(request);
  if (originError) return originError;

  await destroySession();
  return json({ ok: true });
}
