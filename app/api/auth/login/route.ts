import { env } from "cloudflare:workers";
import { ensureAuthTables, hashPassword, recordUserActivity, sessionCookie } from "../../../../db/auth";

export async function POST(request: Request) {
  await ensureAuthTables();
  const { identifier, email, password } = await request.json() as Record<string,string>;
  const cleanIdentifier = (identifier || email || "").trim().toLowerCase();
  if (!cleanIdentifier || !password) return Response.json({ error: "Укажите ник или почту и пароль." }, { status: 400 });
  const user = await env.DB.prepare(
    "SELECT id,email,minecraft_nick,password_hash,password_salt FROM users WHERE lower(email) = ? OR lower(minecraft_nick) = ? LIMIT 1"
  ).bind(cleanIdentifier, cleanIdentifier).first<Record<string,string>>();
  if (!user) return Response.json({ error: "Неверный ник, почта или пароль." }, { status: 401 });
  const secured = await hashPassword(password ?? "", user.password_salt);
  if (secured.hash !== user.password_hash) return Response.json({ error: "Неверный ник, почта или пароль." }, { status: 401 });
  const session = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO sessions (id,user_id,remaining_entries,expires_at,created_at) VALUES (?,?,?,?,?)")
    .bind(session, user.id, 2, Date.now() + 2592000000, Date.now()).run();
  await recordUserActivity(user.id, "login", "Вход в профиль на сайте", "website");
  return Response.json({ ok: true, user: { email: user.email, minecraftNick: user.minecraft_nick }, remainingEntries: 2 }, { headers: { "Set-Cookie": sessionCookie(session) } });
}
