export async function GET() {
  return Response.json({
    version: "0.7.2",
    url: "https://github.com/NexusMC202/website_NexusMC/releases/download/launcher-v0.7.2/NEXUS-Launcher.exe",
    sha256: "69fd00cf31d2ac0aa928e7c7a6718d73080526188f0ba4a267fb8dbbb180486a",
    notes: "Скины NEXUS в Minecraft и публичная Fabric-сборка",
  }, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
