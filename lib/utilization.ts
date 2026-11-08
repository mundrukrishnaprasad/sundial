export type HoursInput = {
  hours: number | string;
  billable: boolean;
};

export type HoursSummary = {
  total: number;
  billable: number;
  nonBillable: number;
  utilization: number;
};

export function roundHours(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function summarizeHours(rows: HoursInput[]): HoursSummary {
  let total = 0;
  let billable = 0;

  for (const row of rows) {
    const hours = Number(row.hours);
    if (!Number.isFinite(hours) || hours <= 0) continue;
    total += hours;
    if (row.billable) billable += hours;
  }

  total = roundHours(total);
  billable = roundHours(billable);

  return {
    total,
    billable,
    nonBillable: roundHours(total - billable),
    utilization: total > 0 ? Math.round((billable / total) * 100) : 0,
  };
}

export function formatHours(value: number | string): string {
  const hours = Number(value);
  if (!Number.isFinite(hours)) return "0h";
  return `${roundHours(hours)}h`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}
