export function parseDateOnly(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return null;
  if (date.toISOString().slice(0, 10) !== value) return null;
  return date;
}

export function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function startOfWeek(date: Date): Date {
  const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const weekday = day.getUTCDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  return addDays(day, offset);
}

export function currentWeekStart(): string {
  return toDateOnly(startOfWeek(new Date()));
}

export function isWeekStart(value: string): boolean {
  const date = parseDateOnly(value);
  return date !== null && date.getUTCDay() === 1;
}

export function weekDays(weekStart: string): string[] {
  const start = parseDateOnly(weekStart);
  if (!start) return [];
  return Array.from({ length: 7 }, (_, index) => toDateOnly(addDays(start, index)));
}

export function formatDate(value: string, options?: Intl.DateTimeFormatOptions): string {
  const date = parseDateOnly(value);
  if (!date) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
    ...options,
  }).format(date);
}

export function weekdayName(value: string): string {
  const date = parseDateOnly(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(date);
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function formatWeekLabel(weekStart: string): string {
  const start = parseDateOnly(weekStart);
  if (!start) return weekStart;
  const end = addDays(start, 6);
  const monthDay = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
  return `${monthDay.format(start)} – ${monthDay.format(end)}, ${end.getUTCFullYear()}`;
}
