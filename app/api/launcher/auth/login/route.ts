import { env } from "cloudflare:workers";
import { ensureAuthTables, hashLauncherToken, hashPassword, recordUserActivity } from "../../../../../db/auth";
import { allowMinecraftNick } from "../../../../../db/minecraftServer";

export async function POST(request: Request) {
  await ensureAuthTables();
  const { identifier, password } = await request.json() as Record<string, string>;
  const cleanIdentifier = (identifier ?? "").trim().toLowerCase();
  if (!cleanIdentifier || !password) {
    return Response.json({ error: "Укажите ник или почту и пароль." }, { status: 400 });
  }
  const user = await env.DB.prepare(
    "SELECT id,email,minecraft_nick,password_hash,password_salt,skin_key,skin_model FROM users WHERE lower(email)=? OR lower(minecraft_nick)=? LIMIT 1",
  ).bind(cleanIdentifier, cleanIdentifier).first<Record<string, string>>();
  if (!user) return Response.json({ error: "Неверный ник, почта или пароль." }, { status: 401 });
  const secured = await hashPassword(password, user.password_salt);
  if (secured.hash !== user.password_hash) {
    return Response.json({ error: "Неверный ник, почта или пароль." }, { status: 401 });
  }
  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = Array.from(tokenBytes, byte => byte.toString(16).padStart(2, "0")).join("");
  const tokenHash = await hashLauncherToken(token);
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare("DELETE FROM launcher_sessions WHERE expires_at<=?").bind(now),
    env.DB.prepare("INSERT INTO launcher_sessions (token_hash,user_id,expires_at,created_at,last_used_at) VALUES (?,?,?,?,?)")
      .bind(tokenHash, user.id, now + 2592000000, now, now),
  ]);
  try {
    await allowMinecraftNick(user.minecraft_nick);
  } catch (serverSyncError) {
    console.error(JSON.stringify({ event: "minecraft_whitelist_resync_failed", minecraftNick: user.minecraft_nick,
      error: serverSyncError instanceof Error ? serverSyncError.message : "unknown" }));
  }
  await recordUserActivity(user.id, "login", "Вход через NEXUS Launcher", "launcher");
  return Response.json({
    token,
    expiresAt: now + 2592000000,
    user: {
      email: user.email,
      minecraftNick: user.minecraft_nick,
      skinUrl: user.skin_key ? "/api/launcher/profile/skin" : null,
      skinModel: user.skin_model ?? "default",
    },
  });
}
