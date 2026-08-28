import type { Metadata } from "next";
import Link from "next/link";
import { FluxFooter, SiteHeader } from "../components";

export const metadata: Metadata = {
  title: "Скачать лаунчер",
  description: "Скачайте официальный NEXUS Launcher для Windows и macOS.",
};

const WINDOWS_EXE_DOWNLOAD = "https://nexusmc-site.robloxksergg.workers.dev/api/launcher/download/NexusLauncher.exe";
const WINDOWS_ZIP_DOWNLOAD = "https://nexusmc-site.robloxksergg.workers.dev/api/launcher/download/NEXUS-Launcher-Portable-v0.9.6.zip";
const DOWNLOAD_BASE = "https://nexusmc-site.robloxksergg.workers.dev/api/launcher/download";

export default function DownloadPage() {
  return <main className="download-page">
    <SiteHeader />
    <section className="download-hero">
      <p>OFFICIAL CLIENT / FORCECORE INC.</p>
      <h1>ТВОЙ ВХОД<br />В <span>NEXUS.</span></h1>
      <div className="download-intro">
        <p>Официальный лаунчер устанавливает нужную версию Minecraft, проверяет сборки GEARMORPH и AURION и автоматически получает обновления.</p>
        <span>ТЕКУЩАЯ ВЕРСИЯ · 0.9.6</span>
      </div>
    </section>

    <section className="platform-section">
      <header><p>ВЫБЕРИТЕ ПЛАТФОРМУ / 03</p><h2>СКАЧАТЬ<br />ЛАУНЧЕР</h2></header>
      <div className="platform-grid">
        <article className="platform-card available">
          <div className="platform-number">01</div>
          <div className="platform-icon" aria-hidden="true">▦</div>
          <div><small>ДОСТУПНО СЕЙЧАС</small><h3>WINDOWS</h3><p>Windows 10/11 · 64-bit<br />EXE — обычный запус<br />ZIP — стабильная portable-версия</p></div>
          <div className="download-options">
            <a href={WINDOWS_EXE_DOWNLOAD}>СКАЧАТЬ EXE <b>↓</b><small>v0.9.6 · один файл</small></a>
            <a href={WINDOWS_ZIP_DOWNLOAD}>СКАЧАТЬ ZIP <b>↓</b><small>v0.9.6 · рекомендуется</small></a>
          </div>
        </article>
        <article className="platform-card available macos-card">
          <div className="platform-number">02</div>
          <div className="platform-icon" aria-hidden="true">⌘</div>
          <div><small>ДОСТУПНО СЕЙЧАС</small><h3>macOS</h3><p>Нативные версии для Apple Silicon и Intel.<br />DMG — установка · ZIP — обычный архив.</p></div>
          <div className="download-options macos-download-options">
            <a href={`${DOWNLOAD_BASE}/NEXUS-Launcher-macOS-arm64.dmg`}>APPLE DMG <b>↓</b><small>M1 / M2 / M3 / M4 · РЕКОМЕНДУЕТСЯ</small></a>
            <a href={`${DOWNLOAD_BASE}/NEXUS-Launcher-macOS-arm64.zip`}>APPLE ZIP <b>↓</b><small>M1 / M2 / M3 / M4 · ОБЫЧНЫЙ АРХИВ</small></a>
            <a href={`${DOWNLOAD_BASE}/NEXUS-Launcher-macOS-x64.dmg`}>INTEL DMG <b>↓</b><small>Intel x64 · РЕКОМЕНДУЕТСЯ</small></a>
            <a href={`${DOWNLOAD_BASE}/NEXUS-Launcher-macOS-x64.zip`}>INTEL ZIP <b>↓</b><small>Intel x64 · ОБЫЧНЫЙ АРХИВ</small></a>
          </div>
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
      <div><b>01</b><p>Windows: распакуйте ZIP и запустите EXE. macOS: откройте DMG либо распакуйте ZIP и перенесите приложение в Applications.</p></div>
      <div><b>02</b><p>Войдите в аккаунт, созданный на сайте</p></div>
      <div><b>03</b><p>Выберите мир — остальное лаунчер сделает сам</p></div>
      <Link href="/login">СОЗДАТЬ АККАУНТ →</Link>
    </section>
    <FluxFooter />
  </main>;
}
