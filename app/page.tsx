import Link from "next/link";
import { CreatorStack, FluxFooter, ServerStatus, SiteHeader } from "./components";

export default function Home() {
  return <main>
    <section className="home-hero">
      <SiteHeader light />
      <div className="home-photo" />
      <div className="home-copy">
        <p>NEOFORGE 1.21.1 · SEASON II</p>
        <h1>NE<span>X</span>US</h1>
        <h2>ОДНО ЯДРО.<br />БЕСКОНЕЧНЫЕ ВОЗМОЖНОСТИ.</h2>
        <div className="home-actions"><Link href="/login">ПРИСОЕДИНИТЬСЯ ↗</Link><Link href="/world">ИССЛЕДОВАТЬ МИР →</Link></div>
      </div>
      <div className="hero-rail"><span>CREATE</span><span>EXPLORE</span><span>EVOLVE</span><span>UNITE</span></div>
      <ServerStatus />
      <p className="vertical-note">NEXUS WORLD TRANSMISSION / 002</p>
    </section>

    <section className="opening">
      <p className="kicker">THE SECOND EXPEDITION</p>
      <h2>ЗДЕСЬ МИР<br /><i>ПИШУТ ИГРОКИ.</i></h2>
      <div className="opening-grid">
        <p>Наука строит цивилизации. Магия переписывает законы. Союзы и конфликты превращаются в историю, которая остаётся после вас.</p>
        <ol><li><span>01</span> Исследуй</li><li><span>02</span> Создавай</li><li><span>03</span> Объединяйся</li></ol>
      </div>
    </section>

    <section className="landscape-strip">
      <div className="landscape-title"><small>WORLD / 01</small><h2>ВЫЙТИ<br />ЗА ГРАНИЦЫ</h2><Link href="/world">ОТКРЫТЬ АТЛАС ↗</Link></div>
      <div className="landscape-count"><b>05</b><span>УНИКАЛЬНЫХ<br />РЕГИОНОВ</span></div>
    </section>

    <section className="home-creators">
      <div className="creator-heading"><p className="kicker">CREATOR TRANSMISSIONS</p><h2>ИСТОРИИ<br /><i>СООБЩЕСТВА</i></h2><p>Наведи на лист и выбери автора. Лучшие ролики, стримы и хроники игроков живут здесь.</p></div>
      <CreatorStack />
    </section>

    <section className="home-news">
      <div><p className="kicker">LIVE WORLD RECORD</p><h2>СВЕЖЕЕ<br />В ХРОНИКЕ</h2></div>
      <Link href="/chronicle" className="lead-story"><span>DISCOVERY / 0041</span><h3>Открыта броня нового поколения</h3><p>Первое полевое испытание изменило баланс сил.</p><b>29.07.2026 →</b></Link>
      <Link href="/chronicle" className="side-story"><span>CONFLICT / 0012</span><h3>Киборги объявили войну эльфам</h3><b>ЧИТАТЬ →</b></Link>
    </section>
    <FluxFooter />
  </main>;
}
