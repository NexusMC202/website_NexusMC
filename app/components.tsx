"use client";

import Link from "next/link";
import { useState } from "react";

const nav = [
  ["/", "Главная", "Home"],
  ["/world", "Мир", "World"],
  ["/nations", "Государства", "Nations"],
  ["/chronicle", "Хроника", "Chronicle"],
  ["/creators", "Авторы", "Creators"],
];

export function SiteHeader() {
  const [english, setEnglish] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Nexus home">
        <span className="brand-mark">N</span>
        <span>NEXUS<small>SEASON II</small></span>
      </Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Меню">MENU</button>
      <nav className={open ? "nav open" : "nav"}>
        {nav.map(([href, ru, en]) => <Link key={href} href={href}>{english ? en : ru}</Link>)}
      </nav>
      <div className="header-actions">
        <button className="lang" onClick={() => setEnglish(!english)}>{english ? "EN / RU" : "RU / EN"}</button>
        <Link className="login-link" href="/login">{english ? "ENTER" : "ВОЙТИ"} ↗</Link>
      </div>
    </header>
  );
}

export function PageShell({ code, title, subtitle, children }: {
  code: string; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <main>
      <SiteHeader />
      <section className="page-intro">
        <div className="page-number">{code}</div>
        <p className="eyebrow">NEXUS ARCHIVE / SEASON II</p>
        <h1 className="masked-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
        <div className="scroll-cue">SCROLL TO EXPLORE <span>↓</span></div>
      </section>
      {children}
      <FluxFooter />
    </main>
  );
}

export function ServerStatus() {
  const [copied, setCopied] = useState(false);
  async function copyIp() {
    await navigator.clipboard?.writeText("nexus-mc.fun");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <button className="status-card" onClick={copyIp}>
      <span className="status-dot" />
      <span><b>SERVER ONLINE</b><small>{copied ? "ADDRESS COPIED" : "nexus-mc.fun"}</small></span>
      <strong>7 <i>/ 15</i></strong>
    </button>
  );
}

const creators = [
  { n: "01", name: "YOUR CHANNEL", type: "YOUTUBE", color: "amber", note: "Истории и открытия экспедиции" },
  { n: "02", name: "NEXUS LIVE", type: "TWITCH", color: "violet", note: "Прямые трансляции из мира" },
  { n: "03", name: "CREATOR FILE", type: "VIDEO", color: "cyan", note: "Лучшие ролики сообщества" },
  { n: "04", name: "OPEN SIGNAL", type: "APPLY", color: "white", note: "Стань голосом Nexus" },
];

export function CreatorStack() {
  const [active, setActive] = useState(0);
  return (
    <div className="creator-orbit">
      <div className="orbit-lines" />
      {creators.map((creator, index) => (
        <button
          key={creator.n}
          className={`creator-sheet ${creator.color} ${active === index ? "active" : ""}`}
          style={{ "--i": index } as React.CSSProperties}
          onMouseEnter={() => setActive(index)}
          onFocus={() => setActive(index)}
          onClick={() => setActive(index)}
        >
          <span>{creator.n}</span>
          <small>{creator.type}</small>
          <b>{creator.name}</b>
          <p>{creator.note}</p>
          <i>OPEN FILE ↗</i>
        </button>
      ))}
      <div className="orbit-core"><span>VOICES OF</span><b>NEXUS</b><small>{active + 1} / {creators.length}</small></div>
    </div>
  );
}

export function FluxFooter() {
  return (
    <footer className="flux-footer">
      <div className="flux-symbol">F<span>∕</span></div>
      <p>A FLUX PRODUCTION PROJECT</p>
      <h2>ONE CORE.<br />INFINITE POSSIBILITIES.</h2>
      <div className="footer-bottom">
        <span>© 2026 FLUX PRODUCTION</span>
        <a href="https://discord.gg/7f2XJXGCwA">DISCORD ↗</a>
        <a href="https://t.me/+UtquhK9n3kdjZGMy">TELEGRAM ↗</a>
      </div>
    </footer>
  );
}
