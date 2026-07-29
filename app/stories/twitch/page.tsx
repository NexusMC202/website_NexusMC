import Link from "next/link";
import { FluxFooter, SiteHeader } from "../../components";

export default function TwitchPage(){return <main className="media-page twitch-page"><SiteHeader/>
  <section className="twitch-hero"><div><p>LIVE MONITOR / TWITCH</p><h1>ПРЯМОЙ<br />ЭФИР</h1><span className="offline-dot">OFFLINE</span></div><aside><b>0</b><span>ЗРИТЕЛЕЙ<br />СЕЙЧАС</span></aside></section>
  <section className="creator-feature">
    <div className="creator-portrait" aria-label="Зона портрета креатора"><span>СИЯ</span><i>CREATOR / 01</i></div>
    <div className="creator-message"><span>FEATURED CREATOR</span><h2>ВСЕМ ПРИВЕТ!<br />Я <i>СИЯ.</i></h2><p>Провожу прямые эфиры по Nexus, делюсь живым контентом, атмосферой и событиями мира проекта.</p><div className="creator-platforms"><a href="https://twitch.tv/" target="_blank" rel="noreferrer">TWITCH ↗</a><a href="https://youtube.com/" target="_blank" rel="noreferrer">YOUTUBE ↗</a><a href="https://kick.com/" target="_blank" rel="noreferrer">KICK ↗</a></div></div>
    <div className="signal-lines" aria-hidden="true"><i/><i/><i/></div>
  </section>
  <section className="stream-grid"><article><span>STREAMER / STATUS</span><h2>Ожидаем первый эфир</h2><p>Когда подключённый автор начнёт трансляцию, карточка автоматически покажет статус LIVE и число зрителей.</p></article><div><p>Для настоящего live‑статуса потребуется подключить официальный Twitch API.</p><Link href="/stories/apply">ПОДКЛЮЧИТЬ КАНАЛ ↗</Link></div></section><FluxFooter/></main>}
