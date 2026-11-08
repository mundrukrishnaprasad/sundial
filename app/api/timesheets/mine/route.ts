import { apiError, getApiUser, json } from "@/lib/api";
import { resolveWeek } from "@/lib/params";
import { getOrCreateTimesheet, getTimesheet } from "@/lib/queries";

export async function GET(request: Request) {
  const user = await getApiUser();
  if (!user) return apiError("Not authenticated.", 401);

  const url = new URL(request.url);
  const week = resolveWeek(url.searchParams.get("week"));

  await getOrCreateTimesheet(user.id, week);
  const data = await getTimesheet(user.id, week);

  return json({ week, ...data });
}
