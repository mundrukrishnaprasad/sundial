import { describe, expect, it } from "vitest";
import { formatHours, formatPercent, roundHours, summarizeHours } from "../lib/utilization";

describe("utilization helpers", () => {
  it("sums billable and non-billable hours", () => {
    const summary = summarizeHours([
      { hours: 6, billable: true },
      { hours: 2, billable: false },
      { hours: "1.5", billable: true },
    ]);

    expect(summary.total).toBe(9.5);
    expect(summary.billable).toBe(7.5);
    expect(summary.nonBillable).toBe(2);
    expect(summary.utilization).toBe(79);
  });

  it("ignores zero, negative, and invalid rows", () => {
    const summary = summarizeHours([
      { hours: 0, billable: true },
      { hours: -3, billable: true },
      { hours: "not-a-number", billable: true },
      { hours: 4, billable: false },
    ]);

    expect(summary.total).toBe(4);
    expect(summary.utilization).toBe(0);
  });

  it("returns zero utilization for an empty week", () => {
    expect(summarizeHours([])).toEqual({
      total: 0,
      billable: 0,
      nonBillable: 0,
      utilization: 0,
    });
  });

  it("rounds to two decimal places", () => {
    expect(roundHours(1.005)).toBe(1.01);
    expect(roundHours(2.555)).toBe(2.56);
  });

  it("formats hours and percents", () => {
    expect(formatHours(7.5)).toBe("7.5h");
    expect(formatHours(0)).toBe("0h");
    expect(formatHours("abc")).toBe("0h");
    expect(formatPercent(74.4)).toBe("74%");
  });
});
