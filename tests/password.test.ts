import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../lib/password";

describe("password hashing", () => {
  it("verifies a correct password", async () => {
    const hash = await hashPassword("Sundial!2026");
    await expect(verifyPassword("Sundial!2026", hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("Sundial!2026");
    await expect(verifyPassword("sundial!2026", hash)).resolves.toBe(false);
  });

  it("produces a different hash for the same password", async () => {
    const first = await hashPassword("Sundial!2026");
    const second = await hashPassword("Sundial!2026");
    expect(first).not.toBe(second);
  });

  it("rejects malformed hashes", async () => {
    await expect(verifyPassword("x", "not-a-hash")).resolves.toBe(false);
    await expect(verifyPassword("x", "pbkdf2$0$abc$def")).resolves.toBe(false);
  });
});
