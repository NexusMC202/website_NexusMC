const MANIFEST_URL = "https://github.com/NexusMC202/website_NexusMC/releases/download/modpack-gearmorph-v1.3.0/gearmorph-manifest.json";

export async function GET() {
  const upstream = await fetch(MANIFEST_URL, {
    headers: { "User-Agent": "NEXUS-Modpack-Manifest/1.0" },
    cf: { cacheTtl: 60, cacheEverything: true },
  });
  if (!upstream.ok) {
    return Response.json({ error: "GearMorph manifest is temporarily unavailable" }, { status: 503 });
  }
  const manifest = await upstream.json() as Record<string, unknown>;
  // Use an explicit port. Some ISP resolvers do not return Minecraft SRV
  // records and otherwise send players to the closed default port 25565.
  manifest.minecraft_server = "5.83.140.209:25698";
  return Response.json(manifest, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60",
    },
  });
}
