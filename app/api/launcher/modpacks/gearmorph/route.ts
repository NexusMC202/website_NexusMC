export async function GET() {
  return Response.json({
    version: "1.0.0",
    url: "https://github.com/NexusMC202/website_NexusMC/releases/download/modpack-gearmorph-v1.0.0/gearmorph-client-1.0.0.zip",
    sha256: "f9ad261b4dd4b235780a874fc676fd9811fb8c93dcb41939d1c15962fcaa6fe2",
    changelog: "Первая полная публичная сборка GEARMORPH",
    minecraft_server: "play.flux-productions.com",
  }, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
