export async function GET() {
  return Response.json({
    version: "0.7.0",
    url: "https://github.com/NexusMC202/website_NexusMC/releases/download/launcher-v0.7.0/NEXUS-Launcher.exe",
    sha256: "44e265e1ef31b20c354384f44906d843ec5e8500c883bc48856c617b69b59819",
    notes: "Автоматическое обновление NEXUS Launcher",
  }, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
