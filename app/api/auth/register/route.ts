import { env } from "cloudflare:workers";
import { ensureAuthTables, hashPassword, sessionCookie, validateMinecraftSkin } from "../../../../db/auth";

export async function POST(request: Request) {
  await ensureAuthTables();
  const contentType = request.headers.get("content-type") ?? "";
  const payload = contentType.includes("multipart/form-data") ? await request.formData() : await request.json() as Record<string,string>;
  const email = String(payload instanceof FormData ? payload.get("email") ?? "" : payload.email ?? "");
  const password = String(payload instanceof FormData ? payload.get("password") ?? "" : payload.password ?? "");
  const minecraftNick = String(payload instanceof FormData ? payload.get("minecraftNick") ?? "" : payload.minecraftNick ?? "");
  const skin = payload instanceof FormData ? payload.get("skin") : null;
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
  let skinKey: string | null = null;
  if (skin instanceof File && skin.size) {
    if (!validateMinecraftSkin(skin)) return Response.json({ error: "Скин должен быть PNG-файлом размером до 2 МБ." }, { status: 400 });
    const skinBytes = new Uint8Array(await skin.arrayBuffer());
    const skinView = new DataView(skinBytes.buffer);
    const width = skinView.getUint32(16);
    const height = skinView.getUint32(20);
    if (width !== 64 || (height !== 64 && height !== 32)) {
      return Response.json({ error: "Размер скина должен быть 64×64 или 64×32 пикселя." }, { status: 400 });
    }
    skinKey = `skins/${id}.png`;
    await env.SKINS.put(skinKey, skinBytes, { httpMetadata: { contentType: "image/png" } });
  }
  await env.DB.prepare("INSERT INTO users (id,email,minecraft_nick,password_hash,password_salt,created_at,skin_key) VALUES (?,?,?,?,?,?,?)")
    .bind(id, cleanEmail, cleanNick, secured.hash, secured.salt, Date.now(), skinKey).run();
  const session = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO sessions (id,user_id,remaining_entries,expires_at,created_at) VALUES (?,?,?,?,?)")
    .bind(session, id, 2, Date.now() + 2592000000, Date.now()).run();
  return Response.json({ ok: true, user: { email: cleanEmail, minecraftNick: cleanNick }, remainingEntries: 2 }, { headers: { "Set-Cookie": sessionCookie(session) } });
}
