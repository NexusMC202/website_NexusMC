import Link from "next/link";
import { FluxFooter, SiteHeader } from "../components";

const regions = [
  ["01", "Тихая низина", "nexus-lake.png"],
  ["02", "Золотые поля", "nexus-fields.png"],
  ["03", "Северная долина", "nexus-valley.png"],
  ["04", "Белая река", "nexus-river.png"],
];

export default function WorldPage() {
  return <main className="world-page">
    <section className="atlas-hero"><SiteHeader />
      <div className="atlas-copy"><p>WORLD ATLAS / REGION 03</p><h1>СЕВЕРНАЯ<br />ДОЛИНА</h1><div><span>55° 45′ N</span><span>37° 37′ E</span></div></div>
      <div className="atlas-index">01<br />02<br /><b>03</b><br />04<br />05</div>
      <p className="atlas-description">Высокие хвойные леса, отвесные стены и долины, которых ещё нет на картах.</p>
    </section>
    <section className="atlas-body"><header><p>НАЙДИ СВОЁ МЕСТО</p><h2>ЛАНДШАФТЫ<br />NEXUS</h2><span>Проведи по карточкам →</span></header>
      <div className="region-row">{regions.map(([n, title, img]) => <article key={n} style={{backgroundImage:`url('/${img}')`}}><span>{n}</span><h3>{title}</h3><Link href="#">ИССЛЕДОВАТЬ ↗</Link></article>)}</div>
      <div className="world-statement"><h2>МИР НЕ ДЕКОРАЦИЯ.<br /><i>ОН — УЧАСТНИК ИСТОРИИ.</i></h2><p>Каждый регион создаёт собственные маршруты, ресурсы, опасности и причины для войны.</p></div>
    </section><FluxFooter />
  </main>;
}
