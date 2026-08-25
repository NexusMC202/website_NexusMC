export async function GET() {
  return Response.json({
    version: "0.9.3",
    url: "https://github.com/NexusMC202/website_NexusMC/releases/download/launcher-v0.9.3/NexusLauncher.exe",
    sha256: "4a80d68e689200eea45443eb38fcdc8617da5c8e88978b391fa7ad5ed0ad9048",
    notes: "Поддержка выбра обычных и тонких рук для скина NEXUS.",
  }, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
