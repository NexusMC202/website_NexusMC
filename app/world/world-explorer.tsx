"use client";

import { useState } from "react";
import { SiteHeader } from "../components";

const worlds = [
  {
    number: "01",
    eyebrow: "SKY ROUTES / AIR REGION",
    script: "Небо",
    title: <>ВОЗДУШНЫЕ<br />МАРШРУТЫ</>,
    cardTitle: "Небо и корабли",
    image: "/world-sky.png",
    description: "Парящие корабли, открытое небо и маршруты над облаками.",
    coordinates: ["72° 10′ N", "18° 04′ E"],
  },
  {
    number: "02",
    eyebrow: "WORLD ATLAS / MOUNTAIN REGION",
    script: "Высота",
    title: <>ГОРЫ И<br />ПЕЙЗАЖИ</>,
    cardTitle: "Горы и пейзажи",
    image: "/world-lighthouse-hd.png",
    description: "Горные хребты, холодные берега и маяки на краю известного мира.",
    coordinates: ["64° 31′ N", "29° 42′ E"],
  },
  {
    number: "03",
    eyebrow: "CIVILIZATION / LIVING REGION",
    script: "Жизнь",
    title: <>ГОРОДА И<br />ЖИЗНЬ</>,
    cardTitle: "Города и жизнь",
    image: "/world-city.jpg",
    description: "Площади, архитектура и государства, которые создают сами игроки.",
    coordinates: ["55° 45′ N", "37° 37′ E"],
  },
  {
    number: "04",
    eyebrow: "UNDERGROUND / CAVE REGION",
    script: "Глубина",
    title: <>ПЕЩЕРЫ И<br />ШАХТЫ</>,
    cardTitle: "Пещеры и шахты",
    image: "/world-cave.jpg",
    description: "Живые пещеры, древние шахты и ресурсы под поверхностью Nexus.",
    coordinates: ["−128 M", "SECTOR 04"],
  },
  {
    number: "05",
    eyebrow: "ABYSS / SCULK REGION",
    script: "Бездна",
    title: <>СКАЛК И<br />БЕЗДНА</>,
    cardTitle: "Бездна и скалк",
    image: "/world-sculk.jpg",
    description: "Тёмные скалк-биомы, древние руины и опасности, которые слышат каждый шаг.",
    coordinates: ["DEPTH 05", "SIGNAL LOST"],
  },
];

export function WorldExplorer() {
  const [active, setActive] = useState(0);
  const world = worlds[active];

  return <>
    <section className="atlas-hero atlas-interactive" style={{ backgroundImage: `url('${world.image}')` }}>
      <SiteHeader />
      <div className="atlas-copy" key={`copy-${active}`}>
        <p>{world.eyebrow}</p>
        <span className="world-script">{world.script}</span>
        <h1>{world.title}</h1>
        <div><span>{world.coordinates[0]}</span><span>{world.coordinates[1]}</span></div>
      </div>
      <nav className="atlas-index" aria-label="Категории мира">
        {worlds.map((item, index) =>
          <button
            key={item.number}
            type="button"
            className={index === active ? "active" : ""}
            aria-label={`Открыть категорию ${item.cardTitle}`}
            aria-pressed={index === active}
            onClick={() => setActive(index)}
          >{item.number}</button>
        )}
      </nav>
      <p className="atlas-description" key={`description-${active}`}>{world.description}</p>
    </section>

    <section className="atlas-body">
      <header><p>НАЙДИ СВОЁ МЕСТО</p><h2>ЛАНДШАФТЫ<br />NEXUS</h2><span>Выбери категорию →</span></header>
      <div className="region-row region-categories">
        {worlds.map((item, index) =>
          <button
            type="button"
            key={item.number}
            className={index === active ? "active" : ""}
            onClick={() => {
              setActive(index);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{ backgroundImage: `url('${item.image}')` }}
          >
            <span>{item.number}</span>
            <h3>{item.cardTitle}</h3>
            <small>{index === active ? "ОТКРЫТО" : "ИССЛЕДОВАТЬ"} ↗</small>
          </button>
        )}
      </div>
      <div className="world-statement"><h2>МИР НЕ ДЕКОРАЦИЯ.<br /><i>ОН — УЧАСТНИК ИСТОРИИ.</i></h2><p>Каждый регион создаёт собственные маршруты, ресурсы, опасности и причины для войны.</p></div>
    </section>
  </>;
}
