import { env } from "cloudflare:workers";
import { createHash } from "node:crypto";

type ServerEnv = {
  BISQUIT_API_TOKEN?: string;
  BISQUIT_SERVER_ID?: string;
  BISQUIT_PANEL_URL?: string;
};

export function offlineMinecraftUuid(minecraftNick: string): string {
  const digest = createHash("md5").update(`OfflinePlayer:${minecraftNick}`, "utf8").digest();
  digest[6] = (digest[6] & 0x0f) | 0x30;
  digest[8] = (digest[8] & 0x3f) | 0x80;
  const hex = digest.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Add a verified NEXUS identity using the offline UUID used by the launcher. */
export async function allowMinecraftNick(minecraftNick: string): Promise<void> {
  if (!/^[A-Za-z0-9_]{3,16}$/.test(minecraftNick)) throw new Error("invalid Minecraft nick");
  const serverEnv = env as unknown as ServerEnv;
  const token = serverEnv.BISQUIT_API_TOKEN;
  const serverId = serverEnv.BISQUIT_SERVER_ID;
  if (!token || !serverId) throw new Error("Minecraft server integration is not configured");
  const panel = (serverEnv.BISQUIT_PANEL_URL || "https://mgr.bisquit.host").replace(/\/$/, "");
  const serverApi = `${panel}/api/client/servers/${encodeURIComponent(serverId)}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
  const currentResponse = await fetch(`${serverApi}/files/contents?file=${encodeURIComponent("/whitelist.json")}`, { headers });
  if (!currentResponse.ok) throw new Error(`Minecraft whitelist read returned HTTP ${currentResponse.status}`);
  const raw = await currentResponse.json() as Array<{ uuid: string; name: string }>;
  const entries = Array.isArray(raw) ? raw.filter(item => item && typeof item.name === "string") : [];
  const entry = { uuid: offlineMinecraftUuid(minecraftNick), name: minecraftNick };
  const existing = entries.findIndex(item => item.name.toLowerCase() === minecraftNick.toLowerCase());
  if (existing >= 0) entries[existing] = entry;
  else entries.push(entry);

  const writeResponse = await fetch(`${serverApi}/files/write?file=${encodeURIComponent("/whitelist.json")}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" },
    body: JSON.stringify(entries, null, 2),
  });
  if (!writeResponse.ok) throw new Error(`Minecraft whitelist write returned HTTP ${writeResponse.status}`);
  const reloadResponse = await fetch(`${serverApi}/command`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ command: "whitelist reload" }),
  });
  if (!reloadResponse.ok) throw new Error(`Minecraft whitelist reload returned HTTP ${reloadResponse.status}`);
}

/** Atomically replace a player's whitelist identity after an owner-approved rename. */
export async function renameMinecraftNick(previousNick: string, minecraftNick: string): Promise<void> {
  if (!/^[A-Za-z0-9_]{3,16}$/.test(previousNick) || !/^[A-Za-z0-9_]{3,16}$/.test(minecraftNick)) {
    throw new Error("invalid Minecraft nick");
  }
  const serverEnv = env as unknown as ServerEnv;
  const token = serverEnv.BISQUIT_API_TOKEN;
  const serverId = serverEnv.BISQUIT_SERVER_ID;
  if (!token || !serverId) throw new Error("Minecraft server integration is not configured");
  const panel = (serverEnv.BISQUIT_PANEL_URL || "https://mgr.bisquit.host").replace(/\/$/, "");
  const serverApi = `${panel}/api/client/servers/${encodeURIComponent(serverId)}`;
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
  const currentResponse = await fetch(`${serverApi}/files/contents?file=${encodeURIComponent("/whitelist.json")}`, { headers });
  if (!currentResponse.ok) throw new Error(`Minecraft whitelist read returned HTTP ${currentResponse.status}`);
  const raw = await currentResponse.json() as Array<{ uuid: string; name: string }>;
  const entries = (Array.isArray(raw) ? raw : []).filter(item =>
    item && typeof item.name === "string" && item.name.toLowerCase() !== previousNick.toLowerCase() && item.name.toLowerCase() !== minecraftNick.toLowerCase()
  );
  entries.push({ uuid: offlineMinecraftUuid(minecraftNick), name: minecraftNick });
  const writeResponse = await fetch(`${serverApi}/files/write?file=${encodeURIComponent("/whitelist.json")}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" },
    body: JSON.stringify(entries, null, 2),
  });
  if (!writeResponse.ok) throw new Error(`Minecraft whitelist write returned HTTP ${writeResponse.status}`);
  const reloadResponse = await fetch(`${serverApi}/command`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ command: "whitelist reload" }),
  });
  if (!reloadResponse.ok) throw new Error(`Minecraft whitelist reload returned HTTP ${reloadResponse.status}`);
}
