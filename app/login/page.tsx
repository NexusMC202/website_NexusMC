"use client";
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login"|"register">("login");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch(`/api/auth/${mode}`, { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(data) });
    const result = await response.json() as { error?:string };
    setBusy(false);
    if (!response.ok) return setError(result.error ?? "Не удалось продолжить.");
    sessionStorage.setItem("nexus-session-counted", "1");
    window.location.href = "/";
  }

  return <main className="login-page path-login">
    <Link className="back-link" href="/">← <span>ВЕРНУТЬСЯ В NEXUS</span></Link>
    <section className="identity-choice">
      <p>IDENTITY GATE / PLAYER ACCESS</p>
      <h1>{mode === "login" ? <>СНОВА<br />В NEXUS</> : <>НАЧАТЬ<br />ПУТЬ</>}</h1>
      <div className="choice-tabs">
        <button className={mode==="login"?"active":""} onClick={()=>setMode("login")}><b>Уже играете на сервере?</b><span>Тогда войдите в существующий аккаунт.</span></button>
        <button className={mode==="register"?"active":""} onClick={()=>setMode("register")}><b>Ещё не играете, но вам интересно?</b><span>Создайте аккаунт и познакомьтесь с Nexus.</span></button>
      </div>
    </section>
    <form className="login-panel" onSubmit={submit}>
      <div className="form-mode"><button type="button" className={mode==="login"?"active":""} onClick={()=>setMode("login")}>ВХОД</button><button type="button" className={mode==="register"?"active":""} onClick={()=>setMode("register")}>РЕГИСТРАЦИЯ</button></div>
      {mode === "register" && <><label htmlFor="minecraftNick">НИК В MINECRAFT</label><input id="minecraftNick" name="minecraftNick" required minLength={3} placeholder="Steve" /></>}
      <label htmlFor="email">ЭЛЕКТРОННАЯ ПОЧТА</label><input id="email" name="email" type="email" required placeholder="you@example.com"/>
      <label htmlFor="password">ПАРОЛЬ</label><input id="password" name="password" type="password" required minLength={8} placeholder="Минимум 8 символов"/>
      {error && <p className="form-error">{error}</p>}
      <button className="auth-submit" disabled={busy}>{busy ? "ПОДОЖДИТЕ…" : mode === "login" ? "ВОЙТИ В NEXUS →" : "СОЗДАТЬ АККАУНТ →"}</button>
      <p className="session-note">Сессия действует два следующих входа на сайт. После этого потребуется снова указать пароль.</p>
    </form>
  </main>;
}
