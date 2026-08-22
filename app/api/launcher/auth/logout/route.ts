import { env } from "cloudflare:workers";
import { ensureAuthTables, hashLauncherToken, readBearerToken } from "../../../../../db/auth";

export async function POST(request: Request) {
  await ensureAuthTables();
  const token = readBearerToken(request);
  if (token) {
    await env.DB.prepare("DELETE FROM launcher_sessions WHERE token_hash=?")
      .bind(await hashLauncherToken(token)).run();
  }
  return Response.json({ ok: true });
}
