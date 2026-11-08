import { apiError, getApiUser, json } from "@/lib/api";
import { getTimesheetById } from "@/lib/queries";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getApiUser();
  if (!user) return apiError("Not authenticated.", 401);

  const { id } = await context.params;
  const data = await getTimesheetById(id, user);
  if (!data) return apiError("Timesheet not found.", 404);

  return json(data);
}
