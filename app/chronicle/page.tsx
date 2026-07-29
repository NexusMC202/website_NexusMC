import Link from "next/link";
import { FluxFooter, SiteHeader } from "../components";

export default function ChroniclePage() {
  return <main className="chronicle-page"><SiteHeader light />
    <section className="chronicle-head"><p>OFFICIAL WORLD RECORD / SEASON II</p><h1>ХРОНИКА<br /><i>NEXUS</i></h1><div><b>00</b><span>ЗАПИСЕЙ<br />В АРХИВЕ</span></div></section>
    <section className="empty-chronicle">
      <div className="empty-mark">?</div>
      <p className="kicker">ARCHIVE IS WAITING</p><h2>НОВОСТЕЙ<br />ПОКА НЕТ.</h2>
      <p>И это нормально: второй сезон ещё не написал свою историю. Создавайте государства, находите технологии, заключайте союзы и начинайте конфликты — значимые события попадут в официальную хронику.</p>
      <Link href="/login">СОЗДАТЬ ПЕРВОЕ СОБЫТИЕ ↗</Link>
    </section>
    <section className="chronicle-examples"><header><span>ПРИМЕРЫ БУДУЩИХ ЗАПИСЕЙ</span><b>ЭТО НЕ РЕАЛЬНЫЕ НОВОСТИ</b></header><div><article><small>DISCOVERY / EXAMPLE</small><h3>Игроки открыли новую броню</h3></article><article><small>NATION / EXAMPLE</small><h3>На карте появился новый город</h3></article><article><small>CONFLICT / EXAMPLE</small><h3>Две державы начали войну</h3></article></div></section>
    <FluxFooter />
  </main>;
}
