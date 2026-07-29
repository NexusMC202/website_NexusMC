import { FluxFooter, SiteHeader } from "../components";

export default function NationsPage() {
  return <main className="nations-page">
    <section className="nation-hero"><SiteHeader />
      <div className="nation-number">02</div>
      <div className="nation-copy"><p>NATION FILE / 007</p><h1>СЕВЕРНЫЙ<br /><i>ДОМИНИОН</i></h1><p>Государства, города и кланы, созданные игроками. Их архитектура, символы и решения определяют историю Nexus.</p><button>ОТКРЫТЬ ДОСЬЕ ↗</button></div>
      <aside><span>СТОЛИЦА</span><b>Нордхейм</b><span>ФОРМА</span><b>Технократия</b><span>СТАТУС</span><b>Активен</b></aside>
    </section>
    <section className="nation-catalog">
      <header><p>CIVILIZATIONS / SEASON II</p><h2>КАРТА<br />ВЛИЯНИЯ</h2><span>04 активных объединения</span></header>
      <div className="nation-list">
        <article className="featured"><span>01 / ГОСУДАРСТВО</span><h3>Северный Доминион</h3><p>Промышленная держава северных пиков.</p><b>24 ЖИТЕЛЯ ↗</b></article>
        <article><span>02 / ГОРОД</span><h3>Лунная гавань</h3><p>Торговый порт на границе леса.</p><b>ОТКРЫТЬ ↗</b></article>
        <article><span>03 / КЛАН</span><h3>Орден разлома</h3><p>Исследователи аномальных территорий.</p><b>ОТКРЫТЬ ↗</b></article>
      </div>
    </section><FluxFooter />
  </main>;
}
