import { env } from "cloudflare:workers";

const FILES: Record<string, { key: string; type: string }> = {
  "NexusLauncher.exe": {
    key: "launcher/0.9.8/NexusLauncher.exe",
    type: "application/vnd.microsoft.portable-executable",
  },
  "NEXUS-Launcher-Portable-v0.9.6.zip": {
    key: "launcher/0.9.6/NEXUS-Launcher-Portable-v0.9.6.zip",
    type: "application/zip",
  },
  "NEXUS-Launcher-macOS-arm64.dmg": {
    key: "launcher/0.9.6/NEXUS-Launcher-macOS-arm64.dmg",
    type: "application/x-apple-diskimage",
  },
  "NEXUS-Launcher-macOS-arm64.zip": {
    key: "launcher/0.9.6/NEXUS-Launcher-macOS-arm64.zip",
    type: "application/zip",
  },
  "NEXUS-Launcher-macOS-x64.dmg": {
    key: "launcher/0.9.6/NEXUS-Launcher-macOS-x64.dmg",
    type: "application/x-apple-diskimage",
  },
  "NEXUS-Launcher-macOS-x64.zip": {
    key: "launcher/0.9.6/NEXUS-Launcher-macOS-x64.zip",
    type: "application/zip",
  },
};

export async function GET(_request: Request, context: { params: Promise<{ file: string }> }) {
  const { file } = await context.params;
  const clean = decodeURIComponent(file);
  const configured = FILES[clean];
  if (!configured) return new Response(null, { status: 404 });
  const object = await env.SKINS.get(configured.key);
  if (!object) return new Response(null, { status: 404 });
  return new Response(object.body, { headers: {
    "Content-Type": configured.type,
    "Content-Length": String(object.size),
    "Content-Disposition": `attachment; filename="${clean}"`,
    "Cache-Control": "public, max-age=3600, immutable",
    "ETag": object.httpEtag,
    "X-Content-Type-Options": "nosniff",
  } });
}
