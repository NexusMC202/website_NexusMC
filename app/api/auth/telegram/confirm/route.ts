import { env } from "cloudflare:workers";
import {
  ensureTelegramLoginTables,
  sha256,
  telegramLinkSecret,
  validMinecraftNick,
} from "../../../../../db/telegram-login";

export async function POST(request: Request) {
  await ensureTelegramLoginTables();
  const expectedSecret = telegramLinkSecret();
  const suppliedSecret = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (typeof expectedSecret !== "string" || expectedSecret.length < 32 || suppliedSecret !== expectedSecret) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as {
    code?: string;
    telegramId?: string | number;
    minecraftNick?: string;
  };
  const code = body.code?.trim().toUpperCase() ?? "";
  const telegramId = String(body.telegramId ?? "").trim();
  const minecraftNick = body.minecraftNick?.trim() ?? "";
  if (!/^[A-Z2-9]{8}$/.test(code) || !/^\d{1,20}$/.test(telegramId) || !validMinecraftNick(minecraftNick)) {
    return Response.json({ error: "Invalid confirmation payload" }, { status: 400 });
  }

  const now = Date.now();
  const challenge = await env.DB.prepare(
    "SELECT id,minecraft_nick,status,expires_at FROM telegram_login_challenges WHERE code_hash=? LIMIT 1",
  ).bind(await sha256(code)).first<Record<string, string | number>>();
  if (!challenge || challenge.status !== "pending" || Number(challenge.expires_at) < now) {
    return Response.json({ error: "Код недействителен или истёк." }, { status: 404 });
  }
  if (String(challenge.minecraft_nick).toLowerCase() !== minecraftNick.toLowerCase()) {
    return Response.json({ error: "Код создан для другого Minecraft-ника." }, { status: 409 });
  }

  const existingLink = await env.DB.prepare(
    "SELECT telegram_id,user_id,minecraft_nick FROM telegram_links WHERE telegram_id=? OR lower(minecraft_nick)=? LIMIT 1",
  ).bind(telegramId, minecraftNick.toLowerCase()).first<Record<string, string>>();

  let userId = existingLink?.user_id;
  if (existingLink && (
    existingLink.telegram_id !== telegramId
    || existingLink.minecraft_nick.toLowerCase() !== minecraftNick.toLowerCase()
  )) {
    return Response.json({ error: "Telegram-профиль или Minecraft-ник уже имеет другую привязку." }, { status: 409 });
  }

  if (!userId) {
    const existingUser = await env.DB.prepare(
      "SELECT id FROM users WHERE lower(minecraft_nick)=? LIMIT 1",
    ).bind(minecraftNick.toLowerCase()).first<{ id: string }>();
    userId = existingUser?.id ?? crypto.randomUUID();
    if (!existingUser) {
      const randomPassword = crypto.randomUUID().replaceAll("-", "");
      await env.DB.prepare(
        "INSERT INTO users (id,email,minecraft_nick,password_hash,password_salt,created_at) VALUES (?,?,?,?,?,?)",
      ).bind(
        userId,
        `telegram-${telegramId}@players.nexus.invalid`,
        minecraftNick,
        await sha256(randomPassword),
        crypto.randomUUID().replaceAll("-", ""),
        now,
      ).run();
    }
    await env.DB.prepare(
      "INSERT INTO telegram_links (telegram_id,user_id,minecraft_nick,linked_at) VALUES (?,?,?,?)",
    ).bind(telegramId, userId, minecraftNick, now).run();
  }

  await env.DB.prepare(
    "UPDATE telegram_login_challenges SET status='confirmed',telegram_id=?,user_id=?,confirmed_at=? WHERE id=? AND status='pending'",
  ).bind(telegramId, userId, now, challenge.id).run();
  return Response.json({ ok: true, minecraftNick });
}
