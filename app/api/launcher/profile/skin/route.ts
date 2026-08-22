import { env } from "cloudflare:workers";
import { authenticatedLauncherUser, ensureAuthTables } from "../../../../../db/auth";

export async function GET(request: Request) {
  await ensureAuthTables();
  const user = await authenticatedLauncherUser(request);
  if (!user) return Response.json({ error: "Сессия лаунчера недействительна." }, { status: 401 });
  if (!user.skin_key) return new Response(null, { status: 404 });
  const object = await env.SKINS.get(user.skin_key);
  if (!object) return new Response(null, { status: 404 });
  return new Response(object.body, {
    headers: { "Content-Type": "image/png", "Cache-Control": "private, no-store" },
  });
}
