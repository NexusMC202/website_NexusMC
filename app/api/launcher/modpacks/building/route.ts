export async function GET() {
  return Response.json({
    version: "1.0.1",
    url: "https://github.com/NexusMC202/website_NexusMC/releases/download/modpack-building-v1.0.1/building-fabric-client-1.0.1.zip",
    sha256: "20fdf2eafe57a43fde5570de057085e057f383c371c8bb1d8ddd3f7774aeeb4c",
    changelog: "Исправлено падение Iris/Sodium при входе в мир",
    minecraft_server: "build.flux-productions.com",
  }, {
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
