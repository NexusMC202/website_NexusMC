export async function GET() {
  return Response.json({
    version: "1.0.2",
    url: "https://github.com/NexusMC202/website_NexusMC/releases/download/modpack-gearmorph-v1.0.2/gearmorph-client-1.0.2.zip",
    sha256: "11924c2d8aabf11ee0068dfd7adc5a2a1d663ad8ad371af89be8394c9384a0cc",
    changelog: "Исправлен чёрный экран из-за конфликта XaeroLib",
    minecraft_server: "play.flux-productions.com",
  }, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
