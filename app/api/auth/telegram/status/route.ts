import { env } from "cloudflare:workers";
import {
  createWebsiteSession,
  ensureTelegramLoginTables,
} from "../../../../../db/telegram-login";

export async function POST(request: Request) {
  await ensureTelegramLoginTables();
  const body = await request.json() as { challengeId?: string };
  if (!body.challengeId || !/^[0-9a-f-]{36}$/i.test(body.challengeId)) {
    return Response.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const challenge = await env.DB.prepare(
    "SELECT status,user_id,minecraft_nick,expires_at FROM telegram_login_challenges WHERE id=? LIMIT 1",
  ).bind(body.challengeId).first<Record<string, string | number>>();
  if (!challenge || Number(challenge.expires_at) < Date.now()) {
    return Response.json({ status: "expired" }, { status: 410 });
  }
  if (challenge.status !== "confirmed" || !challenge.user_id) {
    return Response.json({ status: challenge.status ?? "pending" });
  }

  const session = await createWebsiteSession(String(challenge.user_id));
  await env.DB.prepare(
    "UPDATE telegram_login_challenges SET status='consumed' WHERE id=? AND status='confirmed'",
  ).bind(body.challengeId).run();
  return Response.json(
    { status: "authenticated", minecraftNick: challenge.minecraft_nick, remainingEntries: 2 },
    { headers: { "Set-Cookie": session.cookie } },
  );
}
