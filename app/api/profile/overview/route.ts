import { env } from "cloudflare:workers";
import { authenticatedUser, ensureAuthTables } from "../../../../db/auth";

export async function GET(request: Request) {
  await ensureAuthTables();
  const user = await authenticatedUser(request);
  if (!user) return Response.json({ error: "Сначала войдите в аккаунт." }, { status: 401 });

  const [activity, donations] = await Promise.all([
    env.DB.prepare(
      "SELECT kind,detail,source,created_at FROM user_activity WHERE user_id=? ORDER BY created_at DESC LIMIT 20",
    ).bind(user.id).all<Record<string, string | number>>(),
    env.DB.prepare(
      "SELECT title,amount_minor,currency,status,created_at FROM donations WHERE user_id=? ORDER BY created_at DESC LIMIT 20",
    ).bind(user.id).all<Record<string, string | number>>(),
  ]);

  return Response.json({
    activity: activity.results.map(row => ({
      kind: row.kind,
      detail: row.detail,
      source: row.source,
      createdAt: Number(row.created_at),
    })),
    donations: donations.results.map(row => ({
      title: row.title,
      amountMinor: Number(row.amount_minor),
      currency: row.currency,
      status: row.status,
      createdAt: Number(row.created_at),
    })),
  });
}
