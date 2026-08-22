import type { Metadata } from "next";
import Link from "next/link";
import { FluxFooter, SiteHeader } from "../components";

export const metadata: Metadata = {
  title: "Скачать лаунчер",
  description: "Скачайте официальный NEXUS Launcher для Windows. Версии для Linux и macOS появятся позже.",
};

const WINDOWS_DOWNLOAD = "https://github.com/NexusMC202/website_NexusMC/releases/download/launcher-v0.7.1/NEXUS-Launcher.exe";

export default function DownloadPage() {
  return <main className="download-page">
    <SiteHeader />
    <section className="download-hero">
      <p>OFFICIAL CLIENT / FORCECORE INC.</p>
      <h1>ТВОЙ ВХОД<br />В <span>NEXUS.</span></h1>
      <div className="download-intro">
        <p>Официальный лаунчер устанавливает нужную версию Minecraft, проверяет сборки GEARMORPH и AURION и автоматически получает обновления.</p>
        <span>ТЕКУЩАЯ ВЕРСИЯ · 0.7.1</span>
      </div>
    </section>

    <section className="platform-section">
      <header><p>ВЫБЕРИТЕ ПЛАТФОРМУ / 03</p><h2>СКАЧАТЬ<br />ЛАУНЧЕР</h2></header>
      <div className="platform-grid">
        <article className="platform-card available">
          <div className="platform-number">01</div>
          <div className="platform-icon" aria-hidden="true">▦</div>
          <div><small>ДОСТУПНО СЕЙЧАС</small><h3>WINDOWS</h3><p>Windows 10/11 · 64-bit<br />Автоматические обновления включены</p></div>
          <a href={WINDOWS_DOWNLOAD}>СКАЧАТЬ ДЛЯ WINDOWS <b>↓</b></a>
        </article>
        <article className="platform-card pending">
          <div className="platform-number">02</div>
          <div className="platform-icon" aria-hidden="true">⌘</div>
          <div><small>В РАЗРАБОТКЕ</small><h3>macOS</h3><p>Версии для Apple Silicon и Intel появятся в следующих релизах.</p></div>
          <span>СКОРО</span>
        </article>
        <article className="platform-card pending">
          <div className="platform-number">03</div>
          <div className="platform-icon" aria-hidden="true">_</div>
          <div><small>В РАЗРАБОТКЕ</small><h3>LINUX</h3><p>Пакеты для основных Linux-дистрибутивов появятся позже.</p></div>
          <span>СКОРО</span>
        </article>
      </div>
    </section>

    <section className="download-steps">
      <div><b>01</b><p>Скачайте и запустите NEXUS Launcher</p></div>
      <div><b>02</b><p>Войдите в аккаунт, созданный на сайте</p></div>
      <div><b>03</b><p>Выберите мир — остальное лаунчер сделает сам</p></div>
      <Link href="/login">СОЗДАТЬ АККАУНТ →</Link>
    </section>
    <FluxFooter />
  </main>;
}
