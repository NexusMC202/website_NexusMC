import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("home presents both official NEXUS worlds", async () => {
  const source = await readFile("app/page.tsx", "utf8");
  assert.match(source, /GEARMORPH/);
  assert.match(source, /AURION/);
  assert.match(source, /СОЗДАТЬ АККАУНТ/);
});

test("player skins are managed only from the profile", async () => {
  const [login, profile, api] = await Promise.all([
    readFile("app/login/page.tsx", "utf8"),
    readFile("app/profile/page.tsx", "utf8"),
    readFile("app/api/profile/skin/route.ts", "utf8"),
  ]);
  assert.doesNotMatch(login, /accept="image\/png"/);
  assert.match(login, /СКИН УСТАНАВЛИВАЕТСЯ ПОСЛЕ РЕГИСТРАЦИИ/);
  assert.match(profile, /ЗАМЕНИТЬ СКИН/);
  assert.match(api, /width !== 64/);
  assert.match(api, /env\.SKINS\.put/);
});

test("registration uses email verification and has no Telegram flow", async () => {
  const [login, requestCode] = await Promise.all([
    readFile("app/login/page.tsx", "utf8"),
    readFile("app/api/auth/email/request-code/route.ts", "utf8"),
  ]);
  assert.doesNotMatch(login, /Telegram|telegram|TG \+ НИК/);
  assert.match(login, /verificationCode/);
  assert.match(login, /content-type.*application\/json/);
  assert.match(requestCode, /padStart\(6/);
  assert.match(requestCode, /600_000/);
});

test("password recovery uses an emailed one-time code", async () => {
  const [login, requestReset, confirmReset] = await Promise.all([
    readFile("app/login/page.tsx", "utf8"),
    readFile("app/api/auth/password-reset/request-code/route.ts", "utf8"),
    readFile("app/api/auth/password-reset/confirm/route.ts", "utf8"),
  ]);
  assert.match(login, /ЗАБЫЛИ ПАРОЛЬ/);
  assert.match(login, /СОХРАНИТЬ НОВЫЙ ПАРОЛЬ/);
  assert.match(requestReset, /password_reset_codes/);
  assert.match(requestReset, /восстановление аккаунта NEXUS/);
  assert.match(confirmReset, /hashPassword/);
  assert.match(confirmReset, /DELETE FROM sessions/);
});
