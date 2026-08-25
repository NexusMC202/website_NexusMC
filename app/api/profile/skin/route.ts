import { env } from "cloudflare:workers";
import { authenticatedUser, ensureAuthTables, recordUserActivity, validateMinecraftSkin } from "../../../../db/auth";

export async function GET(request: Request) {
  await ensureAuthTables();
  const user = await authenticatedUser(request);
  if (!user?.skin_key) return new Response(null, { status: 404 });
  const object = await env.SKINS.get(user.skin_key);
  if (!object) return new Response(null, { status: 404 });
  return new Response(object.body, { headers: { "Content-Type": "image/png", "Cache-Control": "private, max-age=300" } });
}

export async function PUT(request: Request) {
  await ensureAuthTables();
  const user = await authenticatedUser(request);
  if (!user) return Response.json({ error: "Сначала войдите в аккаунт." }, { status: 401 });
  const data = await request.formData();
  const skin = data.get("skin");
  if (!(skin instanceof File) || !validateMinecraftSkin(skin)) {
    return Response.json({ error: "Выберите PNG-скин размером до 2 МБ." }, { status: 400 });
  }
  const bytes = new Uint8Array(await skin.arrayBuffer());
  const width = new DataView(bytes.buffer).getUint32(16);
  const height = new DataView(bytes.buffer).getUint32(20);
  if (width !== 64 || (height !== 64 && height !== 32)) {
    return Response.json({ error: "Размер скина должен быть 64×64 или 64×32 пикселя." }, { status: 400 });
  }
  const key = `skins/${user.id}.png`;
  await env.SKINS.put(key, bytes, { httpMetadata: { contentType: "image/png" } });
  await env.DB.prepare("UPDATE users SET skin_key=? WHERE id=?").bind(key, user.id).run();
  await recordUserActivity(user.id, "skin", "Загружен новый PNG-скин", "website");
  return Response.json({ ok: true, skinUrl: `/api/profile/skin?v=${Date.now()}` });
}

export async function PATCH(request: Request) {
  await ensureAuthTables();
  const user = await authenticatedUser(request);
  if (!user) return Response.json({ error: "Сначала войдите в аккаунт." }, { status: 401 });
  const { model } = await request.json() as { model?: string };
  if (model !== "default" && model !== "slim") {
    return Response.json({ error: "Неизвестный тип рук." }, { status: 400 });
  }
  await env.DB.prepare("UPDATE users SET skin_model=? WHERE id=?").bind(model, user.id).run();
  await recordUserActivity(user.id, "skin_model", model === "slim" ? "Выбраны тонкие руки" : "Выбраны обычные руки", "website");
  return Response.json({ ok: true, model });
}
