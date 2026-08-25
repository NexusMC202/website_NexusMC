import type { Metadata } from "next";
import Link from "next/link";
import { FluxFooter, SiteHeader } from "../components";

export const metadata: Metadata = {
  title: "Скачать лаунчер",
  description: "Скачайте официальный NEXUS Launcher для Windows. Версии для Linux и macOS появятся позже.",
};

const WINDOWS_EXE_DOWNLOAD = "https://github.com/NexusMC202/website_NexusMC/releases/download/launcher-v0.9.3/NexusLauncher.exe";
const WINDOWS_ZIP_DOWNLOAD = "https://github.com/NexusMC202/website_NexusMC/releases/download/launcher-v0.9.3/NEXUS-Launcher-Portable-v0.9.3.zip";

export default function DownloadPage() {
  return <main className="download-page">
    <SiteHeader />
    <section className="download-hero">
      <p>OFFICIAL CLIENT / FORCECORE INC.</p>
      <h1>ТВОЙ ВХОД<br />В <span>NEXUS.</span></h1>
      <div className="download-intro">
        <p>Официальный лаунчер устанавливает нужную версию Minecraft, проверяет сборки GEARMORPH и AURION и автоматически получает обновления.</p>
        <span>ТЕКУЩАЯ ВЕРСИЯ · 0.9.3</span>
      </div>
    </section>

    <section className="platform-section">
      <header><p>ВЫБЕРИТЕ ПЛАТФОРМУ / 03</p><h2>СКАЧАТЬ<br />ЛАУНЧЕР</h2></header>
      <div className="platform-grid">
        <article className="platform-card available">
          <div className="platform-number">01</div>
          <div className="platform-icon" aria-hidden="true">▦</div>
          <div><small>ДОСТУПНО СЕЙЧАС</small><h3>WINDOWS</h3><p>Windows 10/11 · 64-bit<br />EXE — обычный запус<br />ZIP — стабильная portable-версия</p></div>
          <div className="windows-download-options">
            <a href={WINDOWS_EXE_DOWNLOAD}>СКАЧАТЬ EXE <b>↓</b><small>v0.9.3 · один файл</small></a>
            <a href={WINDOWS_ZIP_DOWNLOAD}>СКАЧАТЬ ZIP <b>↓</b><small>v0.9.3 · рекомендуется</small></a>
          </div>
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
      <div><b>01</b><p>Скачайте ZIP, распакуйте всю папку и запустите NexusLauncher.exe</p></div>
      <div><b>02</b><p>Войдите в аккаунт, созданный на сайте</p></div>
      <div><b>03</b><p>Выберите мир — остальное лаунчер сделает сам</p></div>
      <Link href="/login">СОЗДАТЬ АККАУНТ →</Link>
    </section>
    <FluxFooter />
  </main>;
}
