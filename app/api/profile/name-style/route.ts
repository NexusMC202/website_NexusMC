import { env } from "cloudflare:workers";
import { authenticatedUser, ensureAuthTables, recordUserActivity } from "../../../../db/auth";
import { hasNameEntitlement, NameStyleMode } from "../../../../db/nameStyles";
import { normalizeHex,validateGradient,validateRainbow } from "../../../../db/cosmetics";
const HEX = /^#[0-9A-F]{6}$/;
const GLYPHS = new Set(["DEFAULT", "PRIME_CIRCUIT", "PRIME_ARCANE"]);
export async function PATCH(request: Request) {
  await ensureAuthTables(); const user = await authenticatedUser(request);
  if (!user) return Response.json({ error: "Требуется авторизация." }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const requested = String(body?.mode ?? "NONE").toUpperCase();
  const mode = (requested === "SOLID" ? "COLOR" : requested === "DEFAULT" ? "NONE" : requested) as NameStyleMode;
  const primary = normalizeHex(body?.primary ?? "#FFFFFF") ?? "";
  const secondary = String(body?.secondary ?? "#A855F7").toUpperCase();
  const glyph = String(body?.glyph ?? "DEFAULT").toUpperCase();
  if (!["NONE","COLOR","GRADIENT","RAINBOW"].includes(mode) || !HEX.test(primary) || !HEX.test(secondary) || !GLYPHS.has(glyph)) return Response.json({ error: "INVALID_COSMETIC_DATA" }, { status: 400 });
  const key = mode === "COLOR" ? "NAME_COLOR_CUSTOM" : mode === "GRADIENT" ? "NAME_GRADIENT" : mode === "RAINBOW" ? "NAME_RAINBOW" : null;
  if (key && !(await hasNameEntitlement(user.id, key))) return Response.json({ error: "COSMETIC_NOT_OWNED" }, { status: 403 });
  if (glyph !== "DEFAULT" && !(await hasNameEntitlement(user.id, "NAME_GLYPH"))) return Response.json({ error: "Дизайн букв доступен с NEXUS PRIME или отдельной покупкой." }, { status: 403 });
  const gradient=mode==="GRADIENT"?validateGradient(body?.gradient):null;const rainbow=mode==="RAINBOW"?validateRainbow(body?.rainbow):null;
  if(mode==="GRADIENT"&&!gradient)return Response.json({error:"INVALID_GRADIENT"},{status:400});if(mode==="RAINBOW"&&!rainbow)return Response.json({error:"INVALID_RAINBOW"},{status:400});
  await env.DB.prepare("UPDATE users SET name_style_mode=?,active_name_color=?,name_style_secondary=?,name_gradient_json=?,name_rainbow_json=?,name_glyph=? WHERE id=?").bind(mode, primary, secondary,gradient?JSON.stringify(gradient):null,rainbow?JSON.stringify(rainbow):null, glyph, user.id).run();
  await recordUserActivity(user.id, "name_style", `Стиль ника: ${mode}`, "website");
  return Response.json({ ok: true, activeNameColor: primary, nameStyleMode: mode, nameStyleSecondary: secondary, nameGlyph: glyph, gradient, rainbow });
}
