import { env } from "cloudflare:workers";

const encoder = new TextEncoder();

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(password: string, saltHex?: string) {
  const salt = saltHex
    ? new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)))
    : crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 120000 }, key, 256);
  return { hash: bytesToHex(new Uint8Array(bits)), salt: bytesToHex(salt) };
}

export async function ensureAuthTables() {
  const db = env.DB;
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, minecraft_nick TEXT NOT NULL, password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, created_at INTEGER NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS sessions (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, remaining_entries INTEGER NOT NULL DEFAULT 2, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL)"),
    db.prepare("CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id)"),
    db.prepare("CREATE INDEX IF NOT EXISTS users_minecraft_nick_idx ON users(minecraft_nick COLLATE NOCASE)"),
    db.prepare("CREATE TABLE IF NOT EXISTS email_verification_codes (id TEXT PRIMARY KEY, email TEXT NOT NULL, code_hash TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS email_verification_codes_email_idx ON email_verification_codes(email COLLATE NOCASE)"),
    db.prepare("CREATE INDEX IF NOT EXISTS email_verification_codes_expiry_idx ON email_verification_codes(expires_at)"),
    db.prepare("CREATE TABLE IF NOT EXISTS password_reset_codes (id TEXT PRIMARY KEY, email TEXT NOT NULL, code_hash TEXT NOT NULL, attempts INTEGER NOT NULL DEFAULT 0, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS password_reset_codes_email_idx ON password_reset_codes(email COLLATE NOCASE)"),
    db.prepare("CREATE INDEX IF NOT EXISTS password_reset_codes_expiry_idx ON password_reset_codes(expires_at)"),
  ]);
  const columns = await db.prepare("PRAGMA table_info(users)").all<{ name: string }>();
  if (!columns.results.some(column => column.name === "skin_key")) {
    await db.prepare("ALTER TABLE users ADD COLUMN skin_key TEXT").run();
  }
}

export async function hashVerificationCode(challengeId: string, code: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(`${challengeId}:${code}`));
  return bytesToHex(new Uint8Array(digest));
}

export async function authenticatedUser(request: Request) {
  const sessionId = readSessionId(request);
  if (!sessionId) return null;
  return env.DB.prepare(
    "SELECT users.id,users.email,users.minecraft_nick,users.skin_key FROM sessions JOIN users ON users.id=sessions.user_id WHERE sessions.id=? AND sessions.expires_at>? AND sessions.remaining_entries>0"
  ).bind(sessionId, Date.now()).first<Record<string, string>>();
}

export function validateMinecraftSkin(file: File) {
  if (file.type !== "image/png" || file.size < 24 || file.size > 2 * 1024 * 1024) return false;
  return true;
}

export function sessionCookie(id: string, maxAge = 60 * 60 * 24 * 30) {
  return `nexus_session=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function readSessionId(request: Request) {
  return request.headers.get("cookie")?.match(/(?:^|;\s*)nexus_session=([^;]+)/)?.[1] ?? null;
}
