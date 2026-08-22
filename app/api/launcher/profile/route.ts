import { authenticatedLauncherUser, ensureAuthTables } from "../../../../db/auth";

export async function GET(request: Request) {
  await ensureAuthTables();
  const user = await authenticatedLauncherUser(request);
  if (!user) return Response.json({ error: "Сессия лаунчера недействительна." }, { status: 401 });
  return Response.json({
    user: {
      email: user.email,
      minecraftNick: user.minecraft_nick,
      skinUrl: user.skin_key ? "/api/launcher/profile/skin" : null,
    },
  });
}
