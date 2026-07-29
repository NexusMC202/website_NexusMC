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
    db.prepare("CREATE TABLE IF NOT EXISTS telegram_login_challenges (id TEXT PRIMARY KEY, code_hash TEXT NOT NULL UNIQUE, minecraft_nick TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', telegram_id TEXT, user_id TEXT, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL, confirmed_at INTEGER)"),
    db.prepare("CREATE INDEX IF NOT EXISTS telegram_login_challenges_nick_idx ON telegram_login_challenges(minecraft_nick COLLATE NOCASE)"),
    db.prepare("CREATE INDEX IF NOT EXISTS telegram_login_challenges_expiry_idx ON telegram_login_challenges(expires_at)"),
    db.prepare("CREATE TABLE IF NOT EXISTS telegram_links (telegram_id TEXT PRIMARY KEY, user_id TEXT NOT NULL UNIQUE, minecraft_nick TEXT NOT NULL, linked_at INTEGER NOT NULL)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS telegram_links_nick_idx ON telegram_links(minecraft_nick COLLATE NOCASE)"),
  ]);
}

export function sessionCookie(id: string, maxAge = 60 * 60 * 24 * 30) {
  return `nexus_session=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

export function readSessionId(request: Request) {
  return request.headers.get("cookie")?.match(/(?:^|;\s*)nexus_session=([^;]+)/)?.[1] ?? null;
}
