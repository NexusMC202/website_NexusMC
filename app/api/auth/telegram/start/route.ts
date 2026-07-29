import { env } from "cloudflare:workers";
import {
  createLinkCode,
  ensureTelegramLoginTables,
  sha256,
  validMinecraftNick,
} from "../../../../../db/telegram-login";

export async function POST(request: Request) {
  await ensureTelegramLoginTables();
  const body = await request.json() as { minecraftNick?: string };
  const minecraftNick = body.minecraftNick?.trim() ?? "";
  if (!validMinecraftNick(minecraftNick)) {
    return Response.json({ error: "Укажите Minecraft-ник: 3–16 латинских букв, цифр или _." }, { status: 400 });
  }

  const now = Date.now();
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM telegram_login_challenges WHERE lower(minecraft_nick)=? AND created_at>?",
  ).bind(minecraftNick.toLowerCase(), now - 60_000).first<{ total: number }>();
  if ((recent?.total ?? 0) >= 3) {
    return Response.json({ error: "Слишком много попыток. Подождите минуту." }, { status: 429 });
  }

  await env.DB.prepare(
    "UPDATE telegram_login_challenges SET status='expired' WHERE status='pending' AND expires_at<?",
  ).bind(now).run();

  const id = crypto.randomUUID();
  const code = createLinkCode();
  await env.DB.prepare(
    "INSERT INTO telegram_login_challenges (id,code_hash,minecraft_nick,status,expires_at,created_at) VALUES (?,?,?,?,?,?)",
  ).bind(id, await sha256(code), minecraftNick, "pending", now + 10 * 60_000, now).run();

  return Response.json({
    ok: true,
    challengeId: id,
    code,
    expiresIn: 600,
    botUrl: `https://t.me/nexusmcabot?start=site_${code}`,
  });
}
