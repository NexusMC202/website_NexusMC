import { FluxFooter, SiteHeader } from "../components";

export default function ChroniclePage() {
  return <main className="chronicle-page"><SiteHeader light />
    <section className="chronicle-head"><p>OFFICIAL WORLD RECORD / 2026</p><h1>ХРОНИКА<br /><i>NEXUS</i></h1><div><b>41</b><span>ЗАПИСЬ<br />В АРХИВЕ</span></div></section>
    <section className="chronicle-grid">
      <article className="chronicle-lead"><div><span>DISCOVERY / 0041</span><h2>ОТКРЫТА БРОНЯ<br />НОВОГО ПОКОЛЕНИЯ</h2><p>Инженеры завершили первое полевое испытание усиленного комплекта.</p><b>29 ИЮЛЯ 2026</b></div></article>
      <article className="chronicle-war"><span>CONFLICT / 0012</span><h2>КИБОРГИ ОБЪЯВИЛИ<br />ВОЙНУ ЭЛЬФАМ</h2><p>Дипломатический канал закрыт. Граница переведена в красный режим.</p><b>ЧИТАТЬ ЗАПИСЬ →</b></article>
      <article className="chronicle-note"><span>WORLD / 0026</span><h2>НОВЫЙ РЕГИОН<br />НА СЕВЕРЕ</h2><b>26.07.2026 →</b></article>
      <article className="chronicle-quote"><p>«История сервера — это не патчноут. Это последствия решений игроков».</p><span>ARCHIVIST / NEXUS</span></article>
    </section><FluxFooter />
  </main>;
}
