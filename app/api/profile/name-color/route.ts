import { env } from "cloudflare:workers";
import { authenticatedUser, ensureAuthTables, recordUserActivity } from "../../../../db/auth";
import { hasNameEntitlement } from "../../../../db/nameStyles";

const HEX_COLOR = /^#[0-9A-F]{6}$/;

export async function PATCH(request: Request) {
  await ensureAuthTables();
  const user = await authenticatedUser(request);
  if (!user) return Response.json({ error: "Требуется авторизация." }, { status: 401 });
  const body = await request.json().catch(() => null) as { color?: unknown } | null;
  const color = typeof body?.color === "string" ? body.color.trim().toUpperCase() : "";
  if (!HEX_COLOR.test(color)) return Response.json({ error: "Введите HEX-код в формате #A855F7." }, { status: 400 });
  if (!(await hasNameEntitlement(user.id, "NAME_COLOR_CUSTOM"))) return Response.json({ error: "Цвет ника нужно купить или получить по подписке NEXUS PLUS." }, { status: 403 });
  await env.DB.prepare("UPDATE users SET active_name_color=?,name_style_mode='SOLID' WHERE id=?").bind(color, user.id).run();
  await recordUserActivity(user.id, "name_color", `Изменён цвет ника на ${color}`, "website");
  return Response.json({ ok: true, activeNameColor: color });
}
