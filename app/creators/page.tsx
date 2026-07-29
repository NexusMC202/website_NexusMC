import { CreatorStack, FluxFooter, SiteHeader } from "../components";

export default function CreatorsPage() {
  return <main className="creators-page"><SiteHeader />
    <section className="creators-hero"><div className="creator-title"><p>CREATOR TRANSMISSIONS / 04 FILES</p><h1>ГОЛОСА<br /><i>ЭКСПЕДИЦИИ</i></h1><p>Ролики, прямые эфиры и истории людей, которые документируют жизнь Nexus.</p></div><CreatorStack /></section>
    <section className="creator-program"><span>ОТКРЫТЫЙ СИГНАЛ</span><h2>ТВОЙ КАНАЛ<br />МОЖЕТ БЫТЬ ЗДЕСЬ.</h2><button>СТАТЬ АВТОРОМ ↗</button></section><FluxFooter />
  </main>;
}
