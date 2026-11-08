import { describe, expect, it } from "vitest";
import {
  addDays,
  currentWeekStart,
  formatWeekLabel,
  isWeekStart,
  parseDateOnly,
  startOfWeek,
  toDateOnly,
  weekDays,
  weekdayName,
} from "../lib/dates";

describe("date helpers", () => {
  it("parses a valid date-only value", () => {
    const date = parseDateOnly("2026-03-02");
    expect(date).not.toBeNull();
    expect(toDateOnly(date as Date)).toBe("2026-03-02");
  });

  it("rejects invalid and impossible dates", () => {
    expect(parseDateOnly("2026-02-30")).toBeNull();
    expect(parseDateOnly("03/02/2026")).toBeNull();
    expect(parseDateOnly("2026-3-2")).toBeNull();
  });

  it("finds the Monday of a week", () => {
    const wednesday = new Date("2026-03-04T12:00:00.000Z");
    expect(toDateOnly(startOfWeek(wednesday))).toBe("2026-03-02");
  });

  it("keeps Monday as the start of its own week", () => {
    const monday = new Date("2026-03-02T00:00:00.000Z");
    expect(toDateOnly(startOfWeek(monday))).toBe("2026-03-02");
  });

  it("recognises week starts only on Monday", () => {
    expect(isWeekStart("2026-03-02")).toBe(true);
    expect(isWeekStart("2026-03-03")).toBe(false);
  });

  it("returns seven consecutive days", () => {
    expect(weekDays("2026-03-02")).toHaveLength(7);
    expect(weekDays("2026-03-02")[6]).toBe("2026-03-08");
  });

  it("adds days across month boundaries", () => {
    const start = parseDateOnly("2026-02-26") as Date;
    expect(toDateOnly(addDays(start, 4))).toBe("2026-03-02");
  });

  it("formats a week label", () => {
    expect(formatWeekLabel("2026-03-02")).toBe("Mar 2 – Mar 8, 2026");
  });

  it("names the weekday in UTC", () => {
    expect(weekdayName("2026-03-02")).toBe("Mon");
    expect(weekdayName("2026-03-08")).toBe("Sun");
  });

  it("returns a Monday for the current week", () => {
    expect(isWeekStart(currentWeekStart())).toBe(true);
  });
});
