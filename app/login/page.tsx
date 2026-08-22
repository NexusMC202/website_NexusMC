"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Mode = "login" | "register" | "reset";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("register");
  const [challengeId, setChallengeId] = useState("");
  const [pendingForm, setPendingForm] = useState<FormData | null>(null);
  const [pendingEmail, setPendingEmail] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  function switchMode(next: Mode) {
    setMode(next); setChallengeId(""); setPendingForm(null); setPendingEmail(""); setError(""); setNotice("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const formData = new FormData(event.currentTarget);
    if (mode === "register" && !challengeId) {
      const email = String(formData.get("email") ?? "");
      try {
        const response = await fetch("/api/auth/email/request-code", {
          method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }),
        });
        const result = await response.json() as { error?: string; challengeId?: string; email?: string };
        if (!response.ok || !result.challengeId) return setError(result.error ?? "Не удалось отправить код.");
        setPendingForm(formData); setChallengeId(result.challengeId); setPendingEmail(result.email ?? email);
      } catch {
        setError("Не удалось связаться с сервером. Проверьте интернет и попробуйте снова.");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (mode === "reset" && !challengeId) {
      const email = String(formData.get("email") ?? "");
      try {
        const response = await fetch("/api/auth/password-reset/request-code", {
          method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }),
        });
        const result = await response.json() as { error?: string; challengeId?: string; email?: string };
        if (!response.ok || !result.challengeId) return setError(result.error ?? "Не удалось отправить код.");
        setChallengeId(result.challengeId); setPendingEmail(result.email ?? email);
      } catch {
        setError("Не удалось связаться с сервером. Проверьте интернет и попробуйте снова.");
      } finally {
        setBusy(false);
      }
      return;
    }
    const response = mode === "login"
      ? await fetch("/api/auth/login", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify(Object.fromEntries(formData)),
        })
      : mode === "register" ? await fetch("/api/auth/register", {
          method: "POST",
          body: (() => {
            const registration = pendingForm ?? formData;
            registration.set("challengeId", challengeId);
            registration.set("verificationCode", String(formData.get("verificationCode") ?? ""));
            return registration;
          })(),
        }) : await fetch("/api/auth/password-reset/confirm", {
          method: "POST", headers: { "content-type": "application/json" },
          body: JSON.stringify({
            email: pendingEmail, challengeId,
            verificationCode: String(formData.get("verificationCode") ?? ""),
            password: String(formData.get("password") ?? ""),
          }),
        });
    const result = await response.json() as { error?: string };
    setBusy(false);
    if (!response.ok) return setError(result.error ?? "Не удалось продолжить.");
    if (mode === "reset") { switchMode("login"); setNotice("ПАРОЛЬ ИЗМЕНЁН. ТЕПЕРЬ ВОЙДИТЕ В АККАУНТ."); return; }
    window.location.href = "/profile";
  }

  return <main className="login-page path-login">
    <Link className="back-link" href="/">← <span>ВЕРНУТЬСЯ В NEXUS</span></Link>
    <section className="identity-choice">
      <p>IDENTITY GATE / PLAYER ACCESS</p>
      <h1>{mode === "register" ? <>НАЧАТЬ<br />ПУТЬ</> : mode === "reset" ? <>ВЕРНУТЬ<br />ДОСТУП</> : <>СНОВА<br />В NEXUS</>}</h1>
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
        <button type="button" className="forgot-password" onClick={() => switchMode("reset")}>ЗАБЫЛИ ПАРОЛЬ?</button>
      </>}
      {mode === "register" && !challengeId && <>
        <label htmlFor="registerNick">НИК В MINECRAFT</label>
        <input id="registerNick" name="minecraftNick" required minLength={3} maxLength={16} pattern="[A-Za-z0-9_]{3,16}" placeholder="Steve" />
        <label htmlFor="email">ЭЛЕКТРОННАЯ ПОЧТА</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        <label htmlFor="registerPassword">ПАРОЛЬ</label>
        <input id="registerPassword" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="Минимум 8 символов" />
        <p className="registration-skin-note">СКИН УСТАНАВЛИВАЕТСЯ ПОСЛЕ РЕГИСТРАЦИИ В ЛИЧНОМ ПРОФИЛЕ</p>
      </>}
      {mode === "register" && challengeId && <div className="email-code-step">
        <span className="email-code-success">✓ КОД ОТПРАВЛЕН</span><h2>{pendingEmail}</h2>
        <p>Введите шесть цифр из письма. Код действует 10 минут.</p>
        <label htmlFor="verificationCode">КОД ПОДТВЕРЖДЕНИЯ</label>
        <input id="verificationCode" name="verificationCode" className="verification-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required placeholder="000000" />
        <button type="button" className="change-email" onClick={() => { setChallengeId(""); setPendingForm(null); }}>ИЗМЕНИТЬ ПОЧТУ</button>
      </div>}
      {mode === "reset" && !challengeId && <>
        <div className="reset-heading"><span>ВОССТАНОВЛЕНИЕ АККАУНТА</span><p>Укажите почту, привязанную к аккаунту NEXUS. Мы отправим код подтверждения.</p></div>
        <label htmlFor="resetEmail">ЭЛЕКТРОННАЯ ПОЧТА</label>
        <input id="resetEmail" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        <button type="button" className="change-email" onClick={() => switchMode("login")}>← ВЕРНУТЬСЯ КО ВХОДУ</button>
      </>}
      {mode === "reset" && challengeId && <div className="email-code-step">
        <span className="email-code-success">✓ КОД ОТПРАВЛЕН</span><h2>{pendingEmail}</h2>
        <p>Введите код из письма и придумайте новый пароль.</p>
        <label htmlFor="resetCode">КОД ПОДТВЕРЖДЕНИЯ</label>
        <input id="resetCode" name="verificationCode" className="verification-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required placeholder="000000" />
        <label htmlFor="newPassword">НОВЫЙ ПАРОЛЬ</label>
        <input id="newPassword" name="password" type="password" minLength={8} required autoComplete="new-password" placeholder="Минимум 8 символов" />
        <button type="button" className="change-email" onClick={() => { setChallengeId(""); setPendingEmail(""); }}>ЗАПРОСИТЬ КОД ЗАНОВО</button>
      </div>}
      {error && <p className="form-error">{error}</p>}
      {notice && <p className="form-notice">{notice}</p>}
      <button className="auth-submit" disabled={busy}>
        {busy ? "ПОДОЖДИТЕ…" : mode === "login" ? "ВОЙТИ В NEXUS →" : mode === "reset" ? challengeId ? "СОХРАНИТЬ НОВЫЙ ПАРОЛЬ →" : "ПОЛУЧИТЬ КОД →" : challengeId ? "ПОДТВЕРДИТЬ И СОЗДАТЬ →" : "ПОЛУЧИТЬ 6-ЗНАЧНЫЙ КОД →"}
      </button>
      <p className="session-note">Код отправляется только на указанную электронную почту. Никому не сообщайте его.</p>
    </form>
  </main>;
}
