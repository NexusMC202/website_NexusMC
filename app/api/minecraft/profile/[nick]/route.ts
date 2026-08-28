import { env } from "cloudflare:workers";
import { ensureAuthTables } from "../../../../../db/auth";

export async function GET(_request: Request, context: { params: Promise<{ nick: string }> }) {
  await ensureAuthTables();
  const { nick } = await context.params;
  const normalized = decodeURIComponent(nick).trim();
  if (!/^[A-Za-z0-9_]{3,16}$/.test(normalized)) return Response.json({ error: "invalid nick" }, { status: 400 });
  const user = await env.DB.prepare(
    "SELECT minecraft_nick,active_name_color,name_style_mode,name_style_secondary,name_glyph FROM users WHERE lower(minecraft_nick)=lower(?) LIMIT 1",
  ).bind(normalized).first<Record<string, string>>();
  if (!user) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json({ minecraftNick: user.minecraft_nick, activeNameColor: user.active_name_color ?? "#FFFFFF", nameStyleMode: user.name_style_mode ?? "DEFAULT", nameStyleSecondary: user.name_style_secondary ?? "#A855F7", nameGlyph: user.name_glyph ?? "DEFAULT" }, {
    headers: { "Cache-Control": "public, max-age=30" },
  });
}
