import Link from "next/link";
import { FluxFooter, SiteHeader } from "../../components";

const reels = [
  ["12:48", "Первый день экспедиции", "nexus-valley.png"],
  ["08:21", "Как основать государство", "city-capital.jpg"],
  ["16:04", "По тропам нового мира", "nexus-path.png"],
  ["05:39", "Архитектура будущего", "city-harbor.png"],
];

export default function YouTubePage(){return <main className="media-page youtube-page"><SiteHeader/>
  <section className="media-hero"><p>CREATOR SIGNAL / YOUTUBE</p><h1>СМОТРИ<br /><i>NEXUS</i></h1><p>Ролики игроков, обзоры открытий, войны государств и истории экспедиций.</p></section>
  <section className="youtube-showcase"><header><div><span>COMMUNITY PLAYLIST</span><h2>ЖИВАЯ ЛЕНТА<br />МИРА NEXUS</h2></div><p>Демонстрационные карточки. Настоящие видео появятся после подключения каналов игроков.</p></header>
    <div className="reel-window"><div className="reel-track">{[...reels,...reels].map(([time,title,image],i)=><article key={`${title}-${i}`} style={{backgroundImage:`linear-gradient(0deg,#080b0bec,transparent 75%),url('/${image}')`}}><span className="youtube-badge">▶ YOUTUBE</span><b>{time}</b><h3>{title}</h3><small>ПРИМЕР КОНТЕНТА</small></article>)}</div></div>
    <Link className="youtube-cta" href="/stories/apply">ДОБАВИТЬ YOUTUBE-КАНАЛ <span>↗</span></Link>
  </section><FluxFooter/></main>}
