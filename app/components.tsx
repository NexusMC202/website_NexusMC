"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const nav = [
  ["/world", "Мир", "world"],
  ["/nations", "Государства", "states"],
  ["/chronicle", "Хроника", "chronicle"],
  ["/creators", "Авторы", "authors"],
];

function NavItem({ href, label, type, index }: { href:string; label:string; type:string; index:number }) {
  return <Link className={`nav-item nav-${type}`} href={href}>
    <span className="nav-label"><sup>0{index}</sup>{label}</span>
    <span className="nav-shape" aria-hidden="true" />
    <span className="nav-decoration" aria-hidden="true">
      {type === "world" && <><i/><i/><i/><i/><b/><b/></>}
      {type === "states" && <><i/><i/><i/><i/><i/><i/></>}
      {type === "chronicle" && <><i/><i/><i/><i/></>}
      {type === "authors" && <svg viewBox="0 0 100 34" preserveAspectRatio="none"><path d="M3 24 C18 7,17 30,31 14 S44 28,55 12 C59 5,59 29,67 20 S78 11,84 19 C89 25,94 17,98 14"/></svg>}
    </span>
  </Link>;
}

export function SiteHeader({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState("ru");
  const [profile, setProfile] = useState<{ minecraftNick: string } | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then(response => response.ok ? response.json() : null)
      .then((result: { authenticated?: boolean; user?: { minecraftNick?: string } } | null) => {
        if (active && result?.authenticated && result.user?.minecraftNick) {
          setProfile({ minecraftNick: result.user.minecraftNick });
        }
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);
  function toggleLanguage() {
    const next = language === "ru" ? "en" : "ru";
    setLanguage(next);
    localStorage.setItem("nexus-language", next);
    window.dispatchEvent(new CustomEvent("nexus-language", { detail: next }));
  }
  return (
    <header className={`site-header ${light ? "light" : ""}`}>
      <Link className="brand" href="/"><b>N</b><span>NEXUS<small>GEARMORPH · AURION</small></span></Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Открыть меню">MENU</button>
      <nav className={open ? "nav open" : "nav"}>
        {nav.map(([href, label, type], i) => <NavItem key={href} href={href} label={label} type={type} index={i + 1} />)}
      </nav>
      <div className="header-actions"><button className="lang" onClick={toggleLanguage}>{language === "ru" ? "RU / EN" : "EN / RU"}</button>{profile ? <Link className="profile-link" href="/profile"><span>{profile.minecraftNick}</span> ПРОФИЛЬ ↗</Link> : <Link href="/login">ВОЙТИ ↗</Link>}</div>
    </header>
  );
}

export function ServerStatus() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard?.writeText("play.flux-productions.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return <button className="server-chip" onClick={copy}><i /><span>СЕРВЕР В СЕТИ<small>{copied ? "IP СКОПИРОВАН" : "play.flux-productions.com"}</small></span><b>7<em>/15</em></b></button>;
}

const creators = [
  ["01", "YOUTUBE", "YouTube игроков", "night", "/stories/youtube"],
  ["02", "TWITCH", "Прямой эфир", "field", "/stories/twitch"],
  ["03", "VIDEO", "Видеоархив", "lake", "/stories/videos"],
  ["04", "APPLY", "Стать автором", "river", "/stories/apply"],
];

export function CreatorStack() {
  const [active, setActive] = useState(0);
  return (
    <div className="paper-orbit">
      <div className="orbit-ring" />
      {creators.map(([n, type, title, image, href], i) => (
        <Link key={n} href={href} className={`paper-card ${image} ${active === i ? "active" : ""}`} style={{ "--i": i } as React.CSSProperties}
          onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}>
          <span>{n} / {type}</span><strong>{title}</strong><small>ОТКРЫТЬ ↗</small>
        </Link>
      ))}
      <div className="orbit-label"><small>CREATOR FILES</small><b>ГОЛОСА<br />NEXUS</b><span>0{active + 1} / 04</span></div>
    </div>
  );
}

export function FluxFooter() {
  return (
    <footer className="flux-footer">
      <p>СЕТЬ МИРОВ</p><h2>NE<span>X</span>US</h2>
      <div><span>© 2026 FORCECORE INC.</span><a href="https://discord.gg/7f2XJXGCwA">DISCORD ↗</a><a href="https://t.me/+UtquhK9n3kdjZGMy">TELEGRAM ↗</a></div>
    </footer>
  );
}
