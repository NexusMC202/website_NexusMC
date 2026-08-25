export async function GET() {
  return Response.json({
    version: "0.9.4",
    url: "https://github.com/NexusMC202/website_NexusMC/releases/download/launcher-v0.9.4/NexusLauncher.exe",
    sha256: "6681eacbd27a93c42cceb9f9741fe9a7e693f4835748c2c480c9e3e1b7f39531",
    notes: "Надёжный updater сборки: SHA-256, retry, rollback, repair и FTB Quests.",
  }, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
