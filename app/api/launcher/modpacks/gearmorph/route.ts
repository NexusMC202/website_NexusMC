export async function GET() {
  return Response.json({
    version: "1.0.1",
    url: "https://github.com/NexusMC202/website_NexusMC/releases/download/modpack-gearmorph-v1.0.1/gearmorph-client-1.0.1.zip",
    sha256: "be82158784d1b888d667f45f64efa2130b923f44f60bd4de912b30390c206121",
    changelog: "Синхронизация скина NEXUS с Minecraft",
    minecraft_server: "play.flux-productions.com",
  }, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
