import { env } from "cloudflare:workers";
import { ensureAuthTables, hashPassword, sessionCookie } from "../../../../db/auth";

export async function POST(request: Request) {
  await ensureAuthTables();
  const { email, password, minecraftNick } = await request.json() as Record<string,string>;
  const cleanEmail = email?.trim().toLowerCase();
  const cleanNick = minecraftNick?.trim();
  if (!cleanEmail || !cleanNick || !/^[A-Za-z0-9_]{3,16}$/.test(cleanNick) || !password || password.length < 8) {
    return Response.json({ error: "Заполните поля. Ник: 3–16 латинских букв, цифр или _. Пароль — минимум 8 символов." }, { status: 400 });
  }
  const exists = await env.DB.prepare(
    "SELECT email,minecraft_nick FROM users WHERE lower(email) = ? OR lower(minecraft_nick) = ? LIMIT 1"
  ).bind(cleanEmail, cleanNick.toLowerCase()).first<Record<string,string>>();
  if (exists) {
    const nickTaken = exists.minecraft_nick?.toLowerCase() === cleanNick.toLowerCase();
    return Response.json({ error: nickTaken ? "Этот Minecraft-ник уже привязан к аккаунту." : "Аккаунт с такой почтой уже существует." }, { status: 409 });
  }
  const id = crypto.randomUUID();
  const secured = await hashPassword(password);
  await env.DB.prepare("INSERT INTO users (id,email,minecraft_nick,password_hash,password_salt,created_at) VALUES (?,?,?,?,?,?)")
    .bind(id, cleanEmail, cleanNick, secured.hash, secured.salt, Date.now()).run();
  const session = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO sessions (id,user_id,remaining_entries,expires_at,created_at) VALUES (?,?,?,?,?)")
    .bind(session, id, 2, Date.now() + 2592000000, Date.now()).run();
  return Response.json({ ok: true, user: { email: cleanEmail, minecraftNick: cleanNick }, remainingEntries: 2 }, { headers: { "Set-Cookie": sessionCookie(session) } });
}
