import { FluxFooter, SiteHeader } from "../components";

const places = [
  ["01 / ЗИМНИЙ ПОСЁЛОК", "Северный Доминион", "city-winter.jpg"],
  ["02 / ПОРТОВЫЙ ГОРОД", "Лунная гавань", "city-harbor.png"],
  ["03 / ТОРГОВЫЙ КВАРТАЛ", "Дождевой переулок", "city-rain.png"],
  ["04 / СТАРЫЙ ГОРОД", "Красные крыши", "city-roofs.jpg"],
  ["05 / СТАНЦИЯ", "Лесной рубеж", "city-station.png"],
  ["06 / СТОЛИЦА", "Осенний совет", "city-capital.jpg"],
];

export default function NationsPage() {
  return <main className="nations-page">
    <section className="nation-hero city"><SiteHeader />
      <div className="nation-number">02</div>
      <div className="nation-copy"><p>NATIONS / CITIES / CLANS</p><h1>ГОРОДА<br /><i>NEXUS</i></h1><p>Здесь появятся настоящие государства, поселения и кланы игроков второго сезона.</p><button>ОСНОВАТЬ СВОЙ ГОРОД ↗</button></div>
    </section>
    <section className="nation-catalog">
      <header><p>VISUAL CONCEPT ARCHIVE</p><h2>АРХИТЕКТУРА<br /><span className="editorial-word">мира</span></h2><span>6 визуальных направлений</span></header>
      <div className="legal-note"><b>ВАЖНО</b><p>Эти изображения используются только как визуальные референсы. На них не показаны настоящие города сервера NexusMC. Изображения не принадлежат NexusMC или Flux Production, и проект не заявляет авторских прав на них.</p></div>
      <div className="city-grid">{places.map(([meta,title,img])=><article key={title} style={{backgroundImage:`linear-gradient(0deg,rgba(5,8,8,.92),transparent 70%),url('/${img}')`}}><span>{meta}</span><h3>{title}</h3><small>КОНЦЕПТ · НЕ ИГРОВОЙ ГОРОД</small></article>)}</div>
    </section><FluxFooter />
  </main>;
}
