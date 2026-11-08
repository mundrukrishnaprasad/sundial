const ITERATIONS = 60_000;
const KEY_LENGTH = 32;

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

async function derive(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations, hash: "SHA-256" },
    key,
    KEY_LENGTH * 8,
  );
  return new Uint8Array(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const derived = await derive(password, salt, ITERATIONS);
  return `pbkdf2$${ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(derived)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterationsRaw, saltRaw, hashRaw] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterationsRaw || !saltRaw || !hashRaw) return false;
  const iterations = Number(iterationsRaw);
  if (!Number.isFinite(iterations) || iterations < 1) return false;

  const derived = await derive(password, fromBase64Url(saltRaw), iterations);
  const expected = fromBase64Url(hashRaw);
  if (derived.length !== expected.length) return false;

  let difference = 0;
  for (let index = 0; index < derived.length; index += 1) {
    difference |= derived[index] ^ expected[index];
  }
  return difference === 0;
}
