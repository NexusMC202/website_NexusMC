export async function GET() {
  return Response.json({
    version: "1.0.0",
    url: "https://github.com/NexusMC202/website_NexusMC/releases/download/modpack-building-v1.0.0/building-fabric-client-1.0.0.zip",
    sha256: "1526f8ba5a1042e12053c3865179101f4f69347843b031f23ac2d0ca6b8d2934",
    changelog: "Первая полная публичная сборка строительного Fabric-сервера",
    minecraft_server: "build.flux-productions.com",
  }, {
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
