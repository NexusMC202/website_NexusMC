export async function GET() {
  return Response.json({
    version: "0.9.5",
    url: "https://github.com/NexusMC202/website_NexusMC/releases/download/launcher-v0.9.5/NexusLauncher.exe",
    sha256: "7c7afd8fed8c13954545c9970a05dbdd7f67fc2e0a6ed3ab4e27884138a034a7",
    notes: "Исправлен бесконечный цикл самообновления лаунчера.",
  }, {
    headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
  });
}
