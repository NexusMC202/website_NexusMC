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
      version: "0.9.10",
      notes: "Сборка для этой платформы ещё не опубликована.",
    }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=60" } });
  }
  return Response.json({
    platform: "windows",
    available: true,
    version: "0.9.10",
    url: "https://nexusmc-site.robloxksergg.workers.dev/api/launcher/download/NexusLauncher.exe",
    sha256: "4d659440c7facf2f81622a89b1694d8ff98d27617938cea267f0f6bf4cf986d0",
    notes: "Qt переведён на стабильную ветку без внешней ICU-зависимости; добавлена автономная portable-сборка.",
  }, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
