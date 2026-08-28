import { env } from "cloudflare:workers";
import { ensureAuthTables, readSessionId, sessionCookie } from "../../../../db/auth";

async function findSession(request: Request) {
  const id = readSessionId(request);
  if (!id) return { id: null, row: null };
  const row = await env.DB.prepare(
    "SELECT sessions.remaining_entries, sessions.expires_at, users.email, users.minecraft_nick, users.skin_key, users.skin_model, users.active_name_color, users.name_style_mode, users.name_style_secondary, users.name_glyph, users.is_admin FROM sessions JOIN users ON users.id=sessions.user_id WHERE sessions.id=?",
  ).bind(id).first<Record<string, number | string>>();
  return { id, row };
}

export async function GET(request: Request) {
  await ensureAuthTables();
  const { id, row } = await findSession(request);
  if (!id || !row || Number(row.expires_at) < Date.now() || Number(row.remaining_entries) <= 0) {
    return Response.json(
      { authenticated: false },
      id ? { status: 401, headers: { "Set-Cookie": sessionCookie("", 0) } } : undefined,
    );
  }
  return Response.json({
    authenticated: true,
    remainingEntries: Number(row.remaining_entries),
    user: { email: row.email, minecraftNick: row.minecraft_nick, skinUrl: row.skin_key ? "/api/profile/skin" : null, skinModel: row.skin_model ?? "default", activeNameColor: row.active_name_color ?? "#FFFFFF", nameStyleMode: row.name_style_mode ?? "DEFAULT", nameStyleSecondary: row.name_style_secondary ?? "#A855F7", nameGlyph: row.name_glyph ?? "DEFAULT", isAdmin: Number(row.is_admin) === 1 },
  });
}

export async function POST(request: Request) {
  await ensureAuthTables();
  const { id, row } = await findSession(request);
  if (!id) return Response.json({ authenticated: false, reason: "missing" });
  if (!row || Number(row.expires_at) < Date.now() || Number(row.remaining_entries) <= 0) {
    await env.DB.prepare("DELETE FROM sessions WHERE id=?").bind(id).run();
    return Response.json({ authenticated: false, reason: "expired" }, { status: 401, headers: { "Set-Cookie": sessionCookie("", 0) } });
  }
  const remaining = Number(row.remaining_entries) - 1;
  await env.DB.prepare("UPDATE sessions SET remaining_entries=? WHERE id=?").bind(remaining, id).run();
  return Response.json({ authenticated: true, remainingEntries: remaining, user: { email: row.email, minecraftNick: row.minecraft_nick, skinUrl: row.skin_key ? "/api/profile/skin" : null, skinModel: row.skin_model ?? "default", activeNameColor: row.active_name_color ?? "#FFFFFF", nameStyleMode: row.name_style_mode ?? "DEFAULT", nameStyleSecondary: row.name_style_secondary ?? "#A855F7", nameGlyph: row.name_glyph ?? "DEFAULT", isAdmin: Number(row.is_admin) === 1 } });
}
