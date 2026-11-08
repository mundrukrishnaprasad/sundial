import { currentWeekStart, isWeekStart } from "./dates";

export function resolveWeek(value: string | null | undefined): string {
  if (value && isWeekStart(value)) return value;
  return currentWeekStart();
}
