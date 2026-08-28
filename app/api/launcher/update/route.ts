export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const platform = params.get("platform") ?? "windows";
  const arch = params.get("arch") === "x64" ? "x64" : "arm64";
  if (platform === "macos" || platform === "darwin") {
    const hashes = {
      arm64: "897d972dc8434086d6a4e041cb40beb4b7c4ad21ea41e2cd5bacfe794be086cc",
      x64: "fd0571740b3a65847656a0d2fb3e61f52311d4f78ed4ab329f3c85fe0f5996a2",
    };
    return Response.json({
      platform: "macos",
      arch,
      available: true,
      version: "0.9.6",
      url: `https://nexusmc-site.robloxksergg.workers.dev/api/launcher/download/NEXUS-Launcher-macOS-${arch}.dmg`,
      sha256: hashes[arch],
      notes: "Первая нативная версия NEXUS Launcher для macOS.",
    }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
  }
  if (platform !== "windows") {
    return Response.json({
      platform,
      available: false,
      version: "0.9.8",
      notes: "Сборка для этой платформы ещё не опубликована.",
    }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
  }
  return Response.json({
    platform: "windows",
    available: true,
    version: "0.9.8",
    url: "https://nexusmc-site.robloxksergg.workers.dev/api/launcher/download/NexusLauncher.exe",
    sha256: "02ddd936bd0957442212226456253d222e98c18daa4fbad459ce2f58bfad7d6f",
    notes: "Новые баннеры GEARMORPH, ARCHVALE, PINEWOOD и ELDERFALL; обновлён каталог миров.",
  }, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
