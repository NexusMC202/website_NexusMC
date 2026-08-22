import { env } from "cloudflare:workers";
import { ensureAuthTables, hashPassword, hashVerificationCode } from "../../../../../db/auth";

export async function POST(request: Request) {
  await ensureAuthTables();
  const { email, challengeId, verificationCode, password } = await request.json() as Record<string, string | undefined>;
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail || !challengeId || !/^\d{6}$/.test(verificationCode ?? "") || !password || password.length < 8) {
    return Response.json({ error: "Введите код из письма и новый пароль минимум из 8 символов." }, { status: 400 });
  }

  const challenge = await env.DB.prepare("SELECT email,code_hash,attempts,expires_at FROM password_reset_codes WHERE id=?")
    .bind(challengeId).first<Record<string, string | number>>();
  if (!challenge || String(challenge.email).toLowerCase() !== cleanEmail || Number(challenge.expires_at) < Date.now() || Number(challenge.attempts) >= 5) {
    return Response.json({ error: "Код неверен или истёк. Запросите новый." }, { status: 400 });
  }

  const suppliedHash = await hashVerificationCode(challengeId, verificationCode!);
  if (suppliedHash !== challenge.code_hash) {
    await env.DB.prepare("UPDATE password_reset_codes SET attempts=attempts+1 WHERE id=?").bind(challengeId).run();
    return Response.json({ error: "Код неверен или истёк. Запросите новый." }, { status: 400 });
  }

  const user = await env.DB.prepare("SELECT id FROM users WHERE lower(email)=? LIMIT 1").bind(cleanEmail).first<{ id: string }>();
  if (!user) return Response.json({ error: "Код неверен или истёк. Запросите новый." }, { status: 400 });
  const secured = await hashPassword(password);
  await env.DB.batch([
    env.DB.prepare("UPDATE users SET password_hash=?,password_salt=? WHERE id=?").bind(secured.hash, secured.salt, user.id),
    env.DB.prepare("DELETE FROM sessions WHERE user_id=?").bind(user.id),
    env.DB.prepare("DELETE FROM password_reset_codes WHERE id=?").bind(challengeId),
  ]);
  return Response.json({ ok: true });
}
