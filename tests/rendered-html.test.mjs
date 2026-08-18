import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("home presents both official NEXUS worlds", async () => {
  const source = await readFile("app/page.tsx", "utf8");
  assert.match(source, /GEARMORPH/);
  assert.match(source, /AURION/);
  assert.match(source, /СОЗДАТЬ АККАУНТ/);
});

test("registration and profile support player skins", async () => {
  const [login, profile, api] = await Promise.all([
    readFile("app/login/page.tsx", "utf8"),
    readFile("app/profile/page.tsx", "utf8"),
    readFile("app/api/profile/skin/route.ts", "utf8"),
  ]);
  assert.match(login, /accept="image\/png"/);
  assert.match(profile, /ЗАМЕНИТЬ СКИН/);
  assert.match(api, /width !== 64/);
  assert.match(api, /env\.SKINS\.put/);
});
