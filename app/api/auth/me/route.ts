import { apiError, getApiUser, json } from "@/lib/api";

export async function GET() {
  const user = await getApiUser();
  if (!user) return apiError("Not authenticated.", 401);
  return json({ user });
}
