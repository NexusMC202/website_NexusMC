import { env } from "cloudflare:workers";
import { ensureAuthTables, readSessionId, sessionCookie } from "../../../../db/auth";

export async function POST(request: Request) {
  await ensureAuthTables();
  const id = readSessionId(request);
  if (!id) return Response.json({ authenticated: false, reason: "missing" });
  const row = await env.DB.prepare("SELECT sessions.remaining_entries, sessions.expires_at, users.email, users.minecraft_nick FROM sessions JOIN users ON users.id=sessions.user_id WHERE sessions.id=?").bind(id).first<Record<string,number|string>>();
  if (!row || Number(row.expires_at) < Date.now() || Number(row.remaining_entries) <= 0) {
    await env.DB.prepare("DELETE FROM sessions WHERE id=?").bind(id).run();
    return Response.json({ authenticated: false, reason: "expired" }, { status: 401, headers: { "Set-Cookie": sessionCookie("", 0) } });
  }
  const remaining = Number(row.remaining_entries) - 1;
  await env.DB.prepare("UPDATE sessions SET remaining_entries=? WHERE id=?").bind(remaining, id).run();
  return Response.json({ authenticated: true, remainingEntries: remaining, user: { email: row.email, minecraftNick: row.minecraft_nick } });
}
