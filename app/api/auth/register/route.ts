import { env } from "cloudflare:workers";
import { ensureAuthTables, hashPassword, hashVerificationCode, sessionCookie } from "../../../../db/auth";

export async function POST(request: Request) {
  await ensureAuthTables();
  const contentType = request.headers.get("content-type") ?? "";
  const payload = contentType.includes("multipart/form-data") ? await request.formData() : await request.json() as Record<string,string>;
  const email = String(payload instanceof FormData ? payload.get("email") ?? "" : payload.email ?? "");
  const password = String(payload instanceof FormData ? payload.get("password") ?? "" : payload.password ?? "");
  const minecraftNick = String(payload instanceof FormData ? payload.get("minecraftNick") ?? "" : payload.minecraftNick ?? "");
  const challengeId = String(payload instanceof FormData ? payload.get("challengeId") ?? "" : payload.challengeId ?? "");
  const verificationCode = String(payload instanceof FormData ? payload.get("verificationCode") ?? "" : payload.verificationCode ?? "");
  const cleanEmail = email?.trim().toLowerCase();
  const cleanNick = minecraftNick?.trim();
  if (!cleanEmail || !cleanNick || !/^[A-Za-z0-9_]{3,16}$/.test(cleanNick) || !password || password.length < 8) {
    return Response.json({ error: "Заполните поля. Ник: 3–16 латинских букв, цифр или _. Пароль — минимум 8 символов." }, { status: 400 });
  }
  if (!challengeId || !/^\d{6}$/.test(verificationCode)) {
    return Response.json({ error: "Введите шестизначный код из письма." }, { status: 400 });
  }
  const challenge = await env.DB.prepare("SELECT email,code_hash,attempts,expires_at FROM email_verification_codes WHERE id=?")
    .bind(challengeId).first<Record<string, string | number>>();
  if (!challenge || String(challenge.email).toLowerCase() !== cleanEmail || Number(challenge.expires_at) < Date.now() || Number(challenge.attempts) >= 5) {
    return Response.json({ error: "Код истёк. Запросите новый код." }, { status: 400 });
  }
  const suppliedHash = await hashVerificationCode(challengeId, verificationCode);
  if (suppliedHash !== challenge.code_hash) {
    await env.DB.prepare("UPDATE email_verification_codes SET attempts=attempts+1 WHERE id=?").bind(challengeId).run();
    return Response.json({ error: "Неверный код подтверждения." }, { status: 400 });
  }
  const exists = await env.DB.prepare(
    "SELECT email,minecraft_nick FROM users WHERE lower(email) = ? OR lower(minecraft_nick) = ? LIMIT 1"
  ).bind(cleanEmail, cleanNick.toLowerCase()).first<Record<string,string>>();
  if (exists) {
    const nickTaken = exists.minecraft_nick?.toLowerCase() === cleanNick.toLowerCase();
    return Response.json({ error: nickTaken ? "Этот Minecraft-ник уже привязан к аккаунту." : "Аккаунт с такой почтой уже существует." }, { status: 409 });
  }
  const id = crypto.randomUUID();
  try {
    const secured = await hashPassword(password);
    const session = crypto.randomUUID();
    await env.DB.batch([
      env.DB.prepare("INSERT INTO users (id,email,minecraft_nick,password_hash,password_salt,created_at,skin_key) VALUES (?,?,?,?,?,?,?)")
        .bind(id, cleanEmail, cleanNick, secured.hash, secured.salt, Date.now(), null),
      env.DB.prepare("DELETE FROM email_verification_codes WHERE id=?").bind(challengeId),
      env.DB.prepare("INSERT INTO sessions (id,user_id,remaining_entries,expires_at,created_at) VALUES (?,?,?,?,?)")
        .bind(session, id, 2, Date.now() + 2592000000, Date.now()),
    ]);
    return Response.json({ ok: true, user: { email: cleanEmail, minecraftNick: cleanNick }, remainingEntries: 2 }, { headers: { "Set-Cookie": sessionCookie(session) } });
  } catch (registrationError) {
    console.error(JSON.stringify({ event: "registration_failed", error: registrationError instanceof Error ? registrationError.message : "unknown" }));
    return Response.json({ error: "Не удалось завершить регистрацию. Повторите попытку через несколько секунд." }, { status: 500 });
  }
}
