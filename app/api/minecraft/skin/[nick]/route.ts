import { env } from "cloudflare:workers";
import { ensureAuthTables } from "../../../../../db/auth";

export async function GET(_request: Request, context: { params: Promise<{ nick: string }> }) {
  await ensureAuthTables();
  const { nick } = await context.params;
  const cleanNick = decodeURIComponent(nick).replace(/\.png$/i, "");
  if (!/^[A-Za-z0-9_]{3,16}$/.test(cleanNick)) return new Response(null, { status: 404 });
  const user = await env.DB.prepare("SELECT skin_key FROM users WHERE lower(minecraft_nick)=? LIMIT 1")
    .bind(cleanNick.toLowerCase()).first<{ skin_key: string | null }>();
  if (!user?.skin_key) return new Response(null, { status: 404 });
  const object = await env.SKINS.get(user.skin_key);
  if (!object) return new Response(null, { status: 404 });
  return new Response(object.body, { headers: {
    "Content-Type": "image/png",
    "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    "X-Content-Type-Options": "nosniff",
  } });
}
