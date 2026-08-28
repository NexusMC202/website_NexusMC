import { env } from "cloudflare:workers";
import { authenticatedUser, ensureAuthTables, recordUserActivity } from "../../../../db/auth";
import { offlineMinecraftUuid, renameMinecraftNick } from "../../../../db/minecraftServer";

export async function PATCH(request: Request) {
  await ensureAuthTables();
  const user = await authenticatedUser(request);
  if (!user) return Response.json({ error: "AUTH_REQUIRED" }, { status: 401 });
  if (Number(user.is_admin) !== 1) return Response.json({ error: "OWNER_REQUIRED" }, { status: 403 });
  const body = await request.json().catch(() => null) as { minecraftNick?: string } | null;
  const minecraftNick = String(body?.minecraftNick ?? "").trim();
  if (!/^[A-Za-z0-9_]{3,16}$/.test(minecraftNick)) {
    return Response.json({ error: "Ник должен содержать 3–16 латинских букв, цифр или _." }, { status: 400 });
  }
  const duplicate = await env.DB.prepare("SELECT id FROM users WHERE lower(minecraft_nick)=lower(?) AND id<>? LIMIT 1")
    .bind(minecraftNick, user.id).first();
  if (duplicate) return Response.json({ error: "Этот ник уже занят." }, { status: 409 });
  const previousNick = user.minecraft_nick;
  if (previousNick.toLowerCase() === minecraftNick.toLowerCase()) {
    return Response.json({ ok: true, minecraftNick: previousNick });
  }
  try {
    await renameMinecraftNick(previousNick, minecraftNick);
  } catch (error) {
    console.error(JSON.stringify({ event: "owner_nickname_whitelist_failed", previousNick, minecraftNick, error: String(error) }));
    return Response.json({ error: "Сервер не подтвердил новый ник. Изменение отменено." }, { status: 502 });
  }
  const minecraftUuid = offlineMinecraftUuid(minecraftNick);
  await env.DB.prepare("UPDATE users SET minecraft_nick=?,minecraft_uuid=? WHERE id=?")
    .bind(minecraftNick, minecraftUuid, user.id).run();
  await recordUserActivity(user.id, "nickname", `Ник изменён: ${previousNick} → ${minecraftNick}`, "website");
  return Response.json({ ok: true, minecraftNick, minecraftUuid });
}
