import { env } from "cloudflare:workers";
import { ensureAuthTables, hashPassword, sessionCookie } from "../../../../db/auth";

export async function POST(request: Request) {
  await ensureAuthTables();
  const { email, password } = await request.json() as Record<string,string>;
  const user = await env.DB.prepare("SELECT id,email,minecraft_nick,password_hash,password_salt FROM users WHERE email = ?").bind(email?.trim().toLowerCase()).first<Record<string,string>>();
  if (!user) return Response.json({ error: "Неверная почта или пароль." }, { status: 401 });
  const secured = await hashPassword(password ?? "", user.password_salt);
  if (secured.hash !== user.password_hash) return Response.json({ error: "Неверная почта или пароль." }, { status: 401 });
  const session = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO sessions (id,user_id,remaining_entries,expires_at,created_at) VALUES (?,?,?,?,?)")
    .bind(session, user.id, 2, Date.now() + 2592000000, Date.now()).run();
  return Response.json({ ok: true, user: { email: user.email, minecraftNick: user.minecraft_nick }, remainingEntries: 2 }, { headers: { "Set-Cookie": sessionCookie(session) } });
}
