"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Mode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("register");
  const [challengeId, setChallengeId] = useState("");
  const [pendingForm, setPendingForm] = useState<FormData | null>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function switchMode(next: Mode) {
    setMode(next); setChallengeId(""); setPendingForm(null); setPendingEmail(""); setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const formData = new FormData(event.currentTarget);
    if (mode === "register" && !challengeId) {
      const email = String(formData.get("email") ?? "");
      const response = await fetch("/api/auth/email/request-code", {
        method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }),
      });
      const result = await response.json() as { error?: string; challengeId?: string; email?: string };
      setBusy(false);
      if (!response.ok || !result.challengeId) return setError(result.error ?? "Не удалось отправить код.");
      setPendingForm(formData); setChallengeId(result.challengeId); setPendingEmail(result.email ?? email);
      return;
    }
    const response = mode === "login"
      ? await fetch("/api/auth/login", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify(Object.fromEntries(formData)),
        })
      : await fetch("/api/auth/register", {
          method: "POST",
          body: (() => {
            const registration = pendingForm ?? formData;
            registration.set("challengeId", challengeId);
            registration.set("verificationCode", String(formData.get("verificationCode") ?? ""));
            return registration;
          })(),
        });
    const result = await response.json() as { error?: string };
    setBusy(false);
    if (!response.ok) return setError(result.error ?? "Не удалось продолжить.");
    window.location.href = "/profile";
  }

  return <main className="login-page path-login">
    <Link className="back-link" href="/">← <span>ВЕРНУТЬСЯ В NEXUS</span></Link>
    <section className="identity-choice">
      <p>IDENTITY GATE / PLAYER ACCESS</p>
      <h1>{mode === "register" ? <>НАЧАТЬ<br />ПУТЬ</> : <>СНОВА<br />В NEXUS</>}</h1>
      <div className="choice-tabs choice-tabs-email">
        <button className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>
          <b>Новый игрок</b><span>Создайте единый аккаунт NEXUS и подтвердите почту шестизначным кодом.</span>
        </button>
        <button className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>
          <b>Уже есть аккаунт</b><span>Войдите по Minecraft-нику или электронной почте.</span>
        </button>
      </div>
    </section>

    <form className="login-panel" onSubmit={submit}>
      <div className="form-mode form-mode-email">
        <button type="button" className={mode === "register" ? "active" : ""} onClick={() => switchMode("register")}>РЕГИСТРАЦИЯ</button>
        <button type="button" className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>ВХОД</button>
      </div>
      {mode === "login" && <>
        <label htmlFor="identifier">НИК ИЛИ ЭЛЕКТРОННАЯ ПОЧТА</label>
        <input id="identifier" name="identifier" required autoComplete="username" placeholder="Steve или you@example.com" />
        <label htmlFor="password">ПАРОЛЬ</label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="current-password" />
      </>}
      {mode === "register" && !challengeId && <>
        <label htmlFor="registerNick">НИК В MINECRAFT</label>
        <input id="registerNick" name="minecraftNick" required minLength={3} maxLength={16} pattern="[A-Za-z0-9_]{3,16}" placeholder="Steve" />
        <label htmlFor="email">ЭЛЕКТРОННАЯ ПОЧТА</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        <label htmlFor="registerPassword">ПАРОЛЬ</label>
        <input id="registerPassword" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="Минимум 8 символов" />
        <label htmlFor="skin">СКИН ПЕРСОНАЖА <span className="optional-label">НЕОБЯЗАТЕЛЬНО</span></label>
        <label className="skin-drop" htmlFor="skin"><b>ЗАГРУЗИТЬ PNG-СКИН</b><span>64×64 или 64×32 · до 2 МБ</span></label>
        <input className="skin-file" id="skin" name="skin" type="file" accept="image/png" />
      </>}
      {mode === "register" && challengeId && <div className="email-code-step">
        <span>ПИСЬМО ОТПРАВЛЕНО</span><h2>{pendingEmail}</h2>
        <p>Введите шесть цифр из письма. Код действует 10 минут.</p>
        <label htmlFor="verificationCode">КОД ПОДТВЕРЖДЕНИЯ</label>
        <input id="verificationCode" name="verificationCode" className="verification-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required placeholder="000000" />
        <button type="button" className="change-email" onClick={() => { setChallengeId(""); setPendingForm(null); }}>ИЗМЕНИТЬ ПОЧТУ</button>
      </div>}
      {error && <p className="form-error">{error}</p>}
      <button className="auth-submit" disabled={busy}>
        {busy ? "ПОДОЖДИТЕ…" : mode === "login" ? "ВОЙТИ В NEXUS →" : challengeId ? "ПОДТВЕРДИТЬ И СОЗДАТЬ →" : "ПОЛУЧИТЬ 6-ЗНАЧНЫЙ КОД →"}
      </button>
      <p className="session-note">Код отправляется только на указанную электронную почту. Никому не сообщайте его.</p>
    </form>
  </main>;
}
