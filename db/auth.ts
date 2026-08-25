import { env } from "cloudflare:workers";

const encoder = new TextEncoder();

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

export async function hashPassword(password: string, saltHex?: string) {
  const pepper = process.env.PASSWORD_PEPPER
    ?? (env as unknown as { PASSWORD_PEPPER?: string }).PASSWORD_PEPPER;
  if (!pepper) throw new Error("PASSWORD_PEPPER is not configured");
  const salt = saltHex
    ? new Uint8Array(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)))
    : crypto.getRandomValues(new Uint8Array(16));
  const pepperKey = await crypto.subtle.importKey("raw", encoder.encode(pepper), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const pepperedPassword = await crypto.subtle.sign("HMAC", pepperKey, encoder.encode(password));
  const key = await crypto.subtle.importKey("raw", pepperedPassword, "PBKDF2", false, ["deriveBits"]);
  // The private HMAC pepper prevents offline cracking if D1 is leaked; a small
  // PBKDF2 cost keeps authentication within the Workers Free 10 ms CPU budget.
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: 1000 }, key, 256);
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
    db.prepare("CREATE TABLE IF NOT EXISTS launcher_sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL, last_used_at INTEGER NOT NULL)"),
    db.prepare("CREATE INDEX IF NOT EXISTS launcher_sessions_user_idx ON launcher_sessions(user_id)"),
    db.prepare("CREATE INDEX IF NOT EXISTS launcher_sessions_expiry_idx ON launcher_sessions(expires_at)"),
    db.prepare("CREATE TABLE IF NOT EXISTS user_activity (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, kind TEXT NOT NULL, detail TEXT NOT NULL, source TEXT NOT NULL, created_at INTEGER NOT NULL)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_user_activity_user_created ON user_activity(user_id, created_at DESC)"),
    db.prepare("CREATE TABLE IF NOT EXISTS donations (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, title TEXT NOT NULL, amount_minor INTEGER NOT NULL, currency TEXT NOT NULL DEFAULT 'RUB', status TEXT NOT NULL DEFAULT 'paid', created_at INTEGER NOT NULL)"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_donations_user_created ON donations(user_id, created_at DESC)"),
  ]);
  const columns = await db.prepare("PRAGMA table_info(users)").all<{ name: string }>();
  if (!columns.results.some(column => column.name === "skin_key")) {
    await db.prepare("ALTER TABLE users ADD COLUMN skin_key TEXT").run();
  }
  if (!columns.results.some(column => column.name === "skin_model")) {
    await db.prepare("ALTER TABLE users ADD COLUMN skin_model TEXT NOT NULL DEFAULT 'default'").run();
  }
}

export async function recordUserActivity(userId: string, kind: string, detail: string, source: string) {
  await env.DB.prepare(
    "INSERT INTO user_activity (id,user_id,kind,detail,source,created_at) VALUES (?,?,?,?,?,?)",
  ).bind(crypto.randomUUID(), userId, kind.slice(0, 32), detail.slice(0, 240), source.slice(0, 32), Date.now()).run();
}

export async function hashLauncherToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(token));
  return bytesToHex(new Uint8Array(digest));
}

export function readBearerToken(request: Request) {
  const value = request.headers.get("authorization") ?? "";
  return value.startsWith("Bearer ") ? value.slice(7).trim() : null;
}

export async function authenticatedLauncherUser(request: Request) {
  const token = readBearerToken(request);
  if (!token) return null;
  const tokenHash = await hashLauncherToken(token);
  const row = await env.DB.prepare(
    "SELECT launcher_sessions.token_hash,users.id,users.email,users.minecraft_nick,users.skin_key,users.skin_model FROM launcher_sessions JOIN users ON users.id=launcher_sessions.user_id WHERE launcher_sessions.token_hash=? AND launcher_sessions.expires_at>?"
  ).bind(tokenHash, Date.now()).first<Record<string, string>>();
  if (!row) return null;
  await env.DB.prepare("UPDATE launcher_sessions SET last_used_at=? WHERE token_hash=?")
    .bind(Date.now(), tokenHash).run();
  return row;
}

export async function hashVerificationCode(challengeId: string, code: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(`${challengeId}:${code}`));
  return bytesToHex(new Uint8Array(digest));
}

export async function authenticatedUser(request: Request) {
  const sessionId = readSessionId(request);
  if (!sessionId) return null;
  return env.DB.prepare(
    "SELECT users.id,users.email,users.minecraft_nick,users.skin_key,users.skin_model FROM sessions JOIN users ON users.id=sessions.user_id WHERE sessions.id=? AND sessions.expires_at>? AND sessions.remaining_entries>0"
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
