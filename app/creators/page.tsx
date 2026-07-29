import { FluxFooter, SiteHeader } from "../components";

const team = [
  ["01", "Isus_Hrestos", "ОСНОВАТЕЛЬ", "founder"],
  ["02", "StarFox", "СО-ОСНОВАТЕЛЬ", "violet"],
  ["03", "Live", "МОДОДЕЛ", "blue"],
  ["04", "HitoKazu", "СПОНСОР · ИНВЕСТОР", "orange"],
  ["05", "Anhelm", "ГЛАВНЫЙ АДМИНИСТРАТОР", "green"],
  ["06", "Garden", "ГЛАВНЫЙ МОДЕРАТОР", "red"],
];

export default function CreatorsPage() {
  return <main className="creators-page"><SiteHeader />
    <section className="team-head"><p>NEXUS CORE TEAM / 2026</p><h1>ЛЮДИ,<br /><span className="editorial-word">создающие</span> МИР</h1><p>Команда, которая строит сервер, код, правила и пространство для историй игроков.</p></section>
    <section className="team-stack">{team.map(([n,name,role,color])=><article key={name} className={`team-card ${color}`}><div className="team-copy"><span>{n} / CORE MEMBER</span><h2>{name}</h2><p>{role}</p></div><div className="mc-silhouette" aria-label="Белый силуэт Minecraft-персонажа"><i className="head"/><i className="body"/><i className="arm left"/><i className="arm right"/><i className="leg left"/><i className="leg right"/></div></article>)}</section>
    <section className="creator-program"><span>CREATOR PROGRAM</span><h2>СТРИМИШЬ ИЛИ<br />СНИМАЕШЬ NEXUS?</h2><p>После запуска здесь появятся страницы авторов сообщества и ссылки на их каналы.</p><button>ПРИСОЕДИНИТЬСЯ ↗</button></section><FluxFooter />
  </main>;
}
