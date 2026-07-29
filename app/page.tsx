import Link from "next/link";
import { CreatorStack, FluxFooter, ServerStatus, SiteHeader } from "./components";

const pillars = [
  ["01", "TECHNOLOGY", "Технологии", "Механизмы, производство и власть над материей."],
  ["02", "CREATIVITY", "Творчество", "Строй мир, который никто не видел прежде."],
  ["03", "CHAOS", "Хаос", "Магия меняет правила быстрее, чем их успевают записать."],
  ["04", "UNITY", "Единство", "Цивилизации рождаются из союзов, конфликтов и идей."],
  ["05", "SKY", "Небо", "Горизонт — это не граница. Это приглашение."],
];

export default function Home() {
  return (
    <main>
      <SiteHeader />
      <section className="hero">
        <div className="hero-image" />
        <div className="hero-grid" />
        <div className="hero-copy">
          <p className="eyebrow">MINECRAFT · NEOFORGE 1.21.1 · SEASON II</p>
          <h1><span>NE</span><i>X</i><span>US</span></h1>
          <p className="hero-tagline">ONE CORE. <b>INFINITE POSSIBILITIES.</b></p>
          <p className="hero-lead">Наука строит цивилизации. Магия переписывает законы. Игроки решают, каким станет этот мир.</p>
          <div className="hero-actions">
            <Link className="primary-action" href="/login">ПРИСОЕДИНИТЬСЯ <span>↗</span></Link>
            <Link className="text-action" href="/world">ИССЛЕДОВАТЬ МИР →</Link>
          </div>
        </div>
        <ServerStatus />
        <div className="hero-index"><span>TRANSMISSION</span><b>002 / 026</b></div>
        <div className="hero-scroll">SCROLL <span>↓</span></div>
      </section>

      <section className="manifesto section-pad">
        <p className="section-kicker">THE SECOND EXPEDITION</p>
        <h2>ПЯТЬ СИЛ.<br /><em>ОДИН NEXUS.</em></h2>
        <p className="section-copy">Второй сезон — живой science-fantasy мир, где открытия игроков меняют хронику, государства ведут дипломатию, а каждая специализация открывает собственный путь.</p>
        <div className="pillar-list">
          {pillars.map(([n, en, ru, text]) => (
            <article key={n}>
              <span>{n}</span><small>{en}</small><h3>{ru}</h3><p>{text}</p><i>↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className="creator-section section-pad">
        <div className="section-heading">
          <div><p className="section-kicker">CREATOR TRANSMISSIONS</p><h2>ГОЛОСА<br /><em>ЭКСПЕДИЦИИ</em></h2></div>
          <p>Стримеры, режиссёры и авторы сохраняют лучшие моменты Nexus. Наведи на архивный лист, чтобы открыть передачу.</p>
        </div>
        <CreatorStack />
        <Link className="wide-link" href="/creators">ОТКРЫТЬ ВСЕ ПЕРЕДАЧИ <span>04 FILES</span> ↗</Link>
      </section>

      <section className="world-preview">
        <div className="world-image" />
        <div className="world-overlay">
          <p className="section-kicker">WORLD ATLAS / REGION 03</p>
          <h2>ЗЕМЛИ, КОТОРЫЕ<br />ЕЩЁ НЕ ЗНАЮТ<br /><em>ВАШЕГО ИМЕНИ</em></h2>
          <p>Парящие архипелаги, медные столицы, зачарованные леса и территории, которых ещё нет на карте.</p>
          <Link className="primary-action light" href="/world">ОТКРЫТЬ АТЛАС <span>→</span></Link>
        </div>
        <div className="region-index">01<br />02<br /><b>03</b><br />04<br />05</div>
      </section>

      <section className="chronicle-preview section-pad">
        <div className="section-heading">
          <div><p className="section-kicker">LIVE WORLD RECORD</p><h2>ХРОНИКА<br /><em>NEXUS</em></h2></div>
          <Link className="text-action" href="/chronicle">ВСЕ ЗАПИСИ →</Link>
        </div>
        <div className="news-grid">
          <Link href="/chronicle" className="news-card featured"><span>DISCOVERY // 0041</span><h3>ОТКРЫТА БРОНЯ НОВОГО ПОКОЛЕНИЯ</h3><p>Инженеры завершили испытания первого комплекта усиленной брони.</p><i>29.07.2026</i></Link>
          <Link href="/chronicle" className="news-card conflict"><span>CONFLICT // 0012</span><h3>КИБОРГИ ОБЪЯВИЛИ ВОЙНУ ЭЛЬФИЙСКОМУ СОЮЗУ</h3><i>28.07.2026</i></Link>
          <Link href="/nations" className="news-card nation"><span>NATION // 0007</span><h3>СЕВЕРНЫЙ ДОМИНИОН ОТКРЫВАЕТ СТОЛИЦУ</h3><i>26.07.2026</i></Link>
        </div>
      </section>
      <FluxFooter />
    </main>
  );
}
