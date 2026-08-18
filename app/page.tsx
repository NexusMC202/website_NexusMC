import Link from "next/link";
import { FluxFooter, SiteHeader } from "./components";

export default function Home() {
  return <main className="reform-home">
    <section className="reform-hero">
      <SiteHeader />
      <div className="reform-noise" />
      <div className="reform-copy">
        <p className="reform-kicker">FORCECORE INC. / MINECRAFT NETWORK</p>
        <h1>ДВА МИРА.<br /><span>ОДНА ИСТОРИЯ.</span></h1>
        <p className="reform-lead">GEARMORPH — технологическое выживание на NeoForge.<br />AURION — творческий строительный мир на Fabric.</p>
        <div className="reform-actions"><Link href="/login">СОЗДАТЬ АККАУНТ</Link><a href="#worlds">ВЫБРАТЬ МИР ↓</a></div>
      </div>
      <div className="reform-mark">N</div>
      <div className="reform-status"><i /> СЕТЬ NEXUS <b>ONLINE</b></div>
    </section>

    <section id="worlds" className="worlds-reform">
      <header><p>ДОСТУПНЫЕ МИРЫ / 02</p><h2>ВЫБЕРИ СВОЮ<br />РЕАЛЬНОСТЬ</h2></header>
      <div className="world-reform-grid">
        <article className="world-reform-card gearmorph">
          <div className="world-code">01 / NEOFORGE 1.21.1</div>
          <div><small>ТЕХНОЛОГИИ · ВЫЖИВАНИЕ · ПРОГРЕСС</small><h3>GEARMORPH</h3><p>Мир механизмов, опасных экспедиций и больших промышленных проектов.</p><span>play.flux-productions.com</span></div>
        </article>
        <article className="world-reform-card aurion">
          <div className="world-code">02 / FABRIC 1.21.1</div>
          <div><small>СТРОИТЕЛЬСТВО · ТВОРЧЕСТВО · СООБЩЕСТВО</small><h3>AURION</h3><p>Строй города, создавай ландшафты и воплощай проекты без границ.</p><span>build.flux-productions.com</span></div>
        </article>
      </div>
    </section>

    <section className="identity-reform">
      <div><p>PLAYER IDENTITY</p><h2>ТВОЙ НИК.<br />ТВОЙ СКИН.<br /><span>ТВОЯ ЛЕГЕНДА.</span></h2></div>
      <div className="identity-panel"><b>01</b><p>Зарегистрируй единый аккаунт NEXUS</p><b>02</b><p>Установи собственный Minecraft-скин</p><b>03</b><p>Выбери сервер в лаунчере и начинай игру</p><Link href="/login">РЕГИСТРАЦИЯ →</Link></div>
    </section>
    <FluxFooter />
  </main>;
}
