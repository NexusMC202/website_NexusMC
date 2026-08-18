"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

type Mode = "telegram" | "login" | "register";
type TelegramChallenge = {
  challengeId: string;
  code: string;
  botUrl: string;
};

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("telegram");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [challenge, setChallenge] = useState<TelegramChallenge | null>(null);

  useEffect(() => {
    if (!challenge) return;
    const interval = window.setInterval(async () => {
      const response = await fetch("/api/auth/telegram/status", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ challengeId: challenge.challengeId }),
      });
      const result = await response.json() as { status?: string };
      if (result.status === "authenticated") {
        window.clearInterval(interval);
        sessionStorage.setItem("nexus-session-counted", "1");
        window.location.href = "/";
      } else if (response.status === 410 || result.status === "expired") {
        window.clearInterval(interval);
        setChallenge(null);
        setError("Код истёк. Создайте новый.");
      }
    }, 2000);
    return () => window.clearInterval(interval);
  }, [challenge]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);
    const endpoint = mode === "telegram" ? "/api/auth/telegram/start" : `/api/auth/${mode}`;
    const response = await fetch(endpoint, {
      method: "POST",
      ...(mode === "register" ? {} : { headers: { "content-type": "application/json" } }),
      body: mode === "register" ? formData : JSON.stringify(data),
    });
    const result = await response.json() as TelegramChallenge & { error?: string };
    setBusy(false);
    if (!response.ok) return setError(result.error ?? "Не удалось продолжить.");
    if (mode === "telegram") {
      setChallenge(result);
      return;
    }
    sessionStorage.setItem("nexus-session-counted", "1");
    window.location.href = "/";
  }

  return <main className="login-page path-login">
    <Link className="back-link" href="/">← <span>ВЕРНУТЬСЯ В NEXUS</span></Link>
    <section className="identity-choice">
      <p>IDENTITY GATE / PLAYER ACCESS</p>
      <h1>{mode === "register" ? <>НАЧАТЬ<br />ПУТЬ</> : <>СНОВА<br />В NEXUS</>}</h1>
      <div className="choice-tabs">
        <button className={mode === "telegram" ? "active" : ""} onClick={() => { setMode("telegram"); setChallenge(null); setError(""); }}>
          <b>Уже играете на сервере?</b>
          <span>Подтвердите привязанный Minecraft-ник через @nexusmcabot — пароль не нужен.</span>
        </button>
        <button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setChallenge(null); setError(""); }}>
          <b>Ещё не играете, но вам интересно?</b>
          <span>Создайте новый аккаунт и познакомьтесь с Nexus.</span>
        </button>
      </div>
    </section>

    <form className="login-panel" onSubmit={submit}>
      <div className="form-mode form-mode-three">
        <button type="button" className={mode === "telegram" ? "active" : ""} onClick={() => { setMode("telegram"); setChallenge(null); setError(""); }}>TG + НИК</button>
        <button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setChallenge(null); setError(""); }}>ПОЧТА</button>
        <button type="button" className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setChallenge(null); setError(""); }}>РЕГИСТРАЦИЯ</button>
      </div>

      {mode === "telegram" && !challenge && <>
        <label htmlFor="minecraftNick">НИК В MINECRAFT</label>
        <input id="minecraftNick" name="minecraftNick" required minLength={3} maxLength={16} autoComplete="username" placeholder="Steve" />
        <p className="telegram-hint">Работает только для ника, уже привязанного к вашему Telegram в NexusBot.</p>
      </>}

      {mode === "telegram" && challenge && <div className="telegram-challenge" aria-live="polite">
        <span>ОДНОРАЗОВЫЙ КОД</span>
        <strong>{challenge.code}</strong>
        <p>Откройте бота и подтвердите вход. Код действует 10 минут.</p>
        <a className="telegram-open" href={challenge.botUrl} target="_blank" rel="noreferrer">ОТКРЫТЬ @NEXUSMCABOT ↗</a>
        <small>Или отправьте боту: <code>/site {challenge.code}</code></small>
        <i>Ожидаем подтверждение…</i>
      </div>}

      {mode === "login" && <>
        <label htmlFor="identifier">НИК ИЛИ ЭЛЕКТРОННАЯ ПОЧТА</label>
        <input id="identifier" name="identifier" required autoComplete="username" placeholder="Steve или you@example.com" />
        <label htmlFor="password">ПАРОЛЬ САЙТА</label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="current-password" placeholder="Минимум 8 символов" />
      </>}

      {mode === "register" && <>
        <label htmlFor="registerNick">НИК В MINECRAFT</label>
        <input id="registerNick" name="minecraftNick" required minLength={3} maxLength={16} placeholder="Steve" />
        <label htmlFor="email">ЭЛЕКТРОННАЯ ПОЧТА</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        <label htmlFor="registerPassword">ПАРОЛЬ САЙТА</label>
        <input id="registerPassword" name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="Минимум 8 символов" />
        <label htmlFor="skin">СКИН ПЕРСОНАЖА <span className="optional-label">НЕОБЯЗАТЕЛЬНО</span></label>
        <label className="skin-drop" htmlFor="skin"><b>ЗАГРУЗИТЬ PNG-СКИН</b><span>64×64 или классический 64×32 · до 2 МБ</span></label>
        <input className="skin-file" id="skin" name="skin" type="file" accept="image/png" />
      </>}

      {error && <p className="form-error">{error}</p>}
      {!challenge && <button className="auth-submit" disabled={busy}>
        {busy ? "ПОДОЖДИТЕ…" : mode === "telegram" ? "ПОЛУЧИТЬ КОД →" : mode === "login" ? "ВОЙТИ В NEXUS →" : "СОЗДАТЬ АККАУНТ →"}
      </button>}
      <p className="session-note">Игровой пароль никогда не передаётся сайту. Подтверждение выполняется вашим Telegram-аккаунтом.</p>
    </form>
  </main>;
}
