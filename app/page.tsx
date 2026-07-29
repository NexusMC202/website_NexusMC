import Link from "next/link";
import { CreatorStack, FluxFooter, ServerStatus, SiteHeader } from "./components";

export default function Home() {
  return <main>
    <section className="home-hero">
      <SiteHeader light />
      <div className="home-photo" aria-hidden="true">
        <span className="hero-slide hero-slide-night" />
        <span className="hero-slide hero-slide-shore" />
        <span className="hero-slide hero-slide-valley" />
        <span className="hero-slide hero-slide-lighthouse" />
      </div>
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
        <h2>ЗДЕСЬ <span className="editorial-word">мир</span><br /><i>ПИШУТ ИГРОКИ.</i></h2>
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

    <section className="home-news empty-news">
      <div><p className="kicker">LIVE WORLD RECORD</p><h2>ХРОНИКА<br />ЖДЁТ ВАС</h2></div>
      <article className="no-news"><span>АРХИВ / 0000</span><h3>ПОКА НОВОСТЕЙ НЕТ</h3><p>Но первая новость уже может начаться с вашего решения. Играйте, исследуйте, основывайте города — и события сервера появятся здесь.</p><Link href="/login">ВОЙТИ В ИСТОРИЮ ↗</Link></article>
      <aside className="example-news"><span>КАК ЭТО БУДЕТ ВЫГЛЯДЕТЬ</span><p>Открытие новой брони</p><p>Основание государства</p><p>Начало большой войны</p><small>Примеры, не реальные события</small></aside>
    </section>
    <FluxFooter />
  </main>;
}
