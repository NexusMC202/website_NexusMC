export async function GET() {
  return Response.json({
    version: "0.7.1",
    url: "https://github.com/NexusMC202/website_NexusMC/releases/download/launcher-v0.7.1/NEXUS-Launcher.exe",
    sha256: "3aab41b542ff020b62135e9ccb2ec347ab0d3520f260ad05ce33412290135665",
    notes: "Публичная установка полной GEARMORPH-сборки",
  }, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
