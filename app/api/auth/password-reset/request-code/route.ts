import { env } from "cloudflare:workers";
import { ensureAuthTables, hashVerificationCode } from "../../../../../db/auth";

export async function POST(request: Request) {
  await ensureAuthTables();
  const { email } = await request.json() as { email?: string };
  const cleanEmail = email?.trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return Response.json({ error: "Введите корректную электронную почту." }, { status: 400 });
  }

  const recent = await env.DB.prepare("SELECT created_at FROM password_reset_codes WHERE lower(email)=? LIMIT 1")
    .bind(cleanEmail).first<{ created_at: number }>();
  if (recent && Date.now() - Number(recent.created_at) < 60_000) {
    return Response.json({ error: "Новый код можно запросить через минуту." }, { status: 429 });
  }

  const challengeId = crypto.randomUUID();
  const user = await env.DB.prepare("SELECT id FROM users WHERE lower(email)=? LIMIT 1").bind(cleanEmail).first();
  if (!user) {
    return Response.json({ ok: true, challengeId, email: cleanEmail });
  }

  const apiKey = process.env.RESEND_API_KEY
    ?? (env as unknown as { RESEND_API_KEY?: string }).RESEND_API_KEY;
  if (!apiKey) return Response.json({ error: "Отправка писем ещё не подключена администратором." }, { status: 503 });

  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0");
  const codeHash = await hashVerificationCode(challengeId, code);
  await env.DB.prepare("DELETE FROM password_reset_codes WHERE lower(email)=?").bind(cleanEmail).run();
  await env.DB.prepare("INSERT INTO password_reset_codes (id,email,code_hash,attempts,expires_at,created_at) VALUES (?,?,?,?,?,?)")
    .bind(challengeId, cleanEmail, codeHash, 0, Date.now() + 600_000, Date.now()).run();

  const sent = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "NEXUS <noreply@nexusmc.flux-productions.com>",
      to: [cleanEmail],
      subject: `${code} — восстановление аккаунта NEXUS`,
      html: `<div style="background:#080d17;color:#fff;padding:32px;font-family:Arial"><p style="color:#5ee7ff">FORCECORE INC. / NEXUS</p><h1 style="font-size:42px;letter-spacing:8px">${code}</h1><p>Код для восстановления пароля действует 10 минут. Никому его не сообщайте.</p></div>`,
    }),
  });
  if (!sent.ok) {
    await env.DB.prepare("DELETE FROM password_reset_codes WHERE id=?").bind(challengeId).run();
    return Response.json({ error: "Не удалось отправить письмо. Попробуйте позже." }, { status: 502 });
  }
  return Response.json({ ok: true, challengeId, email: cleanEmail });
}
