import { env } from "cloudflare:workers";
export type NameStyleMode = "NONE" | "COLOR" | "GRADIENT" | "RAINBOW";
const rank: Record<string, number> = { supporter: 1, plus: 2, prime: 3, legend: 4 };
const required: Record<string, number> = { NAME_COLOR_CUSTOM: 2, NAME_GRADIENT: 3, NAME_GLYPH: 3, NAME_RAINBOW: 4 };
export async function hasNameEntitlement(userId: string, key: string) {
  const now = Date.now();
  const owned = await env.DB.prepare("SELECT 1 ok FROM user_entitlements WHERE user_id=? AND entitlement_key=? AND (expires_at IS NULL OR expires_at>?) LIMIT 1").bind(userId, key, now).first();
  if (owned) return true;
  const subscription = await env.DB.prepare("SELECT plan_id FROM subscriptions WHERE user_id=? AND status IN ('ACTIVE','CANCELED') AND current_period_end>? ORDER BY current_period_end DESC LIMIT 1").bind(userId, now).first<{ plan_id: string }>();
  return (rank[subscription?.plan_id ?? ""] ?? 0) >= (required[key] ?? 999);
}
export function entitlementForMode(mode: NameStyleMode) {
  return mode === "COLOR" ? "NAME_COLOR_CUSTOM" : mode === "GRADIENT" ? "NAME_GRADIENT" : mode === "RAINBOW" ? "NAME_RAINBOW" : null;
}
