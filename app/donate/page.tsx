import { SiteHeader } from "../components";
import { StorefrontCards } from "../subscription-cards";

export default function DonatePage() {
  return <main className="donate-page"><SiteHeader /><section className="donate-shell">
    <p>SUPPORT NEXUS / COSMETICS ONLY</p><h1>ПОДДЕРЖИТЕ ПРОЕКТ.<br />НАСТРОЙТЕ ПРОФИЛЬ.</h1>
      <StorefrontCards />
    <small>Подписки дают только косметику и не предоставляют OP, StaffCore-права или игровые преимущества.</small><div className="store-links"><a href="/profile/customize">НАСТРОИТЬ ПРОФИЛЬ →</a><a href="/profile/purchases">ИСТОРИЯ ПОКУПОК →</a></div>
  </section></main>;
}
