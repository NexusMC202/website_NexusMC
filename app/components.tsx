"use client";

import Link from "next/link";
import { useState } from "react";

const nav = [
  ["/world", "Мир"],
  ["/nations", "Государства"],
  ["/chronicle", "Хроника"],
  ["/creators", "Авторы"],
];

export function SiteHeader({ light = false }: { light?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <header className={`site-header ${light ? "light" : ""}`}>
      <Link className="brand" href="/"><b>N</b><span>NEXUS<small>SEASON II</small></span></Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Открыть меню">MENU</button>
      <nav className={open ? "nav open" : "nav"}>
        {nav.map(([href, label], i) => <Link key={href} href={href}><sup>0{i + 1}</sup>{label}</Link>)}
      </nav>
      <div className="header-actions"><button className="lang">RU / EN</button><Link href="/login">ВОЙТИ ↗</Link></div>
    </header>
  );
}

export function ServerStatus() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard?.writeText("nexus-mc.fun");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return <button className="server-chip" onClick={copy}><i /><span>СЕРВЕР В СЕТИ<small>{copied ? "IP СКОПИРОВАН" : "nexus-mc.fun"}</small></span><b>7<em>/15</em></b></button>;
}

const creators = [
  ["01", "YOUTUBE", "Хроники экспедиции", "night"],
  ["02", "TWITCH", "Прямой эфир", "field"],
  ["03", "VIDEO", "Голоса Nexus", "lake"],
  ["04", "JOIN", "Ваш канал", "river"],
];

export function CreatorStack() {
  const [active, setActive] = useState(0);
  return (
    <div className="paper-orbit">
      <div className="orbit-ring" />
      {creators.map(([n, type, title, image], i) => (
        <button key={n} className={`paper-card ${image} ${active === i ? "active" : ""}`} style={{ "--i": i } as React.CSSProperties}
          onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}>
          <span>{n} / {type}</span><strong>{title}</strong><small>ОТКРЫТЬ ↗</small>
        </button>
      ))}
      <div className="orbit-label"><small>CREATOR FILES</small><b>ГОЛОСА<br />NEXUS</b><span>0{active + 1} / 04</span></div>
    </div>
  );
}

export function FluxFooter() {
  return (
    <footer className="flux-footer">
      <p>ПРОЕКТ</p><h2>FLUX<br /><span>PRODUCTION</span></h2>
      <div><span>© 2026 NEXUS</span><a href="https://discord.gg/7f2XJXGCwA">DISCORD ↗</a><a href="https://t.me/+UtquhK9n3kdjZGMy">TELEGRAM ↗</a></div>
    </footer>
  );
}
