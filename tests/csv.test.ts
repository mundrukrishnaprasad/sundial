import { describe, expect, it } from "vitest";
import { csvEscape, toCsv } from "../lib/csv";

describe("csv helpers", () => {
  it("leaves plain values untouched", () => {
    expect(csvEscape("Northwind")).toBe("Northwind");
    expect(csvEscape(42)).toBe("42");
  });

  it("quotes values containing commas, quotes, or newlines", () => {
    expect(csvEscape("Rao, Maya")).toBe('"Rao, Maya"');
    expect(csvEscape('He said "hello"')).toBe('"He said ""hello"""');
    expect(csvEscape("line one\nline two")).toBe('"line one\nline two"');
  });

  it("renders empty values for null and undefined", () => {
    expect(csvEscape(null)).toBe("");
    expect(csvEscape(undefined)).toBe("");
  });

  it("joins rows with CRLF", () => {
    expect(toCsv([["a", "b"], [1, 2]])).toBe("a,b\r\n1,2");
  });
});
