import { env } from "cloudflare:workers";
import { ensureAuthTables, readSessionId, sessionCookie } from "../../../../db/auth";

export async function POST(request: Request) {
  await ensureAuthTables();
  const id = readSessionId(request);
  if (id) await env.DB.prepare("DELETE FROM sessions WHERE id=?").bind(id).run();
  return Response.json(
    { ok: true },
    { headers: { "Set-Cookie": sessionCookie("", 0) } },
  );
}
