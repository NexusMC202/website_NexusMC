import { env } from "cloudflare:workers";
import { ensureAuthTables, sessionCookie } from "./auth";

const encoder = new TextEncoder();
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export function createLinkCode(length = 8) {
  const random = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(random, byte => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

export function telegramLinkSecret() {
  return (env as unknown as Record<string, unknown>).TELEGRAM_LINK_SECRET;
}

export function validMinecraftNick(value: string) {
  return /^[A-Za-z0-9_]{3,16}$/.test(value);
}

export async function createWebsiteSession(userId: string) {
  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO sessions (id,user_id,remaining_entries,expires_at,created_at) VALUES (?,?,?,?,?)",
  ).bind(id, userId, 2, Date.now() + 2_592_000_000, Date.now()).run();
  return { id, cookie: sessionCookie(id) };
}

export async function ensureTelegramLoginTables() {
  await ensureAuthTables();
}
