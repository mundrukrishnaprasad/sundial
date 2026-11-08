export function csvEscape(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function toCsv(rows: unknown[][]): string {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\r\n");
}
