"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { SiteHeader } from "../components";
import { SkinViewer3D } from "./skin-viewer";

type SkinModel = "default" | "slim";
type Profile = { email: string; minecraftNick: string; skinUrl?: string | null; skinModel: SkinModel };
type Activity = { kind: string; detail: string; source: string; createdAt: number };
type Donation = { title: string; amountMinor: number; currency: string; status: string; createdAt: number };
const dateTime = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" });

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function refreshOverview() {
    const response = await fetch("/api/profile/overview", { cache: "no-store" });
    if (!response.ok) return;
    const result = await response.json() as { activity: Activity[]; donations: Donation[] };
    setActivity(result.activity); setDonations(result.donations);
  }

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" }).then(async response => {
      if (!response.ok) { window.location.href = "/login"; return null; }
      return response.json() as Promise<{ authenticated: boolean; user: Profile }>;
    }).then(result => {
      if (result?.authenticated) {
        setProfile({ ...result.user, skinModel: result.user.skinModel ?? "default" });
        void refreshOverview();
      }
    }).finally(() => setLoading(false));
  }, []);

  async function uploadSkin(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setMessage("ЗАГРУЖАЕМ СКИН…");
    const data = new FormData(); data.set("skin", file);
    const response = await fetch("/api/profile/skin", { method: "PUT", body: data });
    const result = await response.json() as { error?: string; skinUrl?: string };
    if (!response.ok) return setMessage(result.error ?? "Не удалось загрузить скин.");
    setProfile(current => current ? { ...current, skinUrl: result.skinUrl } : current);
    setMessage("СКИН ОБНОВЛЁН");
    await refreshOverview();
  }

  async function setSkinModel(model: SkinModel) {
    if (!profile || model === profile.skinModel) return;
    setMessage("СОХРАНЯЕМ МОДЕЛЬ…");
    const response = await fetch("/api/profile/skin", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model }) });
    const result = await response.json() as { error?: string };
    if (!response.ok) return setMessage(result.error ?? "Не удалось сохранить модель.");
    setProfile({ ...profile, skinModel: model });
    setMessage(model === "slim" ? "ТОНКИЕ РУКИ ВКЛЮЧЕНЫ" : "ОБЫЧНЫЕ РУКИ ВКЛЮЧЕНЫ");
    await refreshOverview();
  }

  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/"; }

  return <main className="profile-page reform-profile"><SiteHeader /><section className="profile-reform-shell">
    <div className="profile-heading"><p>PLAYER IDENTITY / NEXUS NETWORK</p><h1>ЛИЧНОЕ<br />ДЕЛО</h1></div>
    {loading && <div className="profile-loading">ЗАГРУЗКА…</div>}
    {profile && <>
      <div className="profile-reform-card">
        <div className="skin-stage">
          {profile.skinUrl ? <SkinViewer3D skinUrl={profile.skinUrl} model={profile.skinModel} nick={profile.minecraftNick} /> : <div className="skin-placeholder">{profile.minecraftNick.slice(0, 1).toUpperCase()}</div>}
          <div className="skin-model-control" aria-label="Тип модели скина"><span>ПРОПОРЦИИ РУК</span>
            <button className={profile.skinModel === "default" ? "active" : ""} onClick={() => setSkinModel("default")}>ОБЫЧНЫЕ · 4 PX</button>
            <button className={profile.skinModel === "slim" ? "active" : ""} onClick={() => setSkinModel("slim")}>ТОНКИЕ · 3 PX</button>
          </div>
          <label htmlFor="profileSkin">ЗАМЕНИТЬ СКИН</label><input id="profileSkin" type="file" accept="image/png" onChange={uploadSkin} />{message && <small>{message}</small>}
        </div>
        <div className="profile-data"><span>АКТИВНЫЙ ИГРОК</span><h2>{profile.minecraftNick}</h2><dl>
          <div><dt>ПОДТВЕРЖДЁННАЯ ПОЧТА</dt><dd>{profile.email}</dd></div><div><dt>ДОСТУПНЫЕ МИРЫ</dt><dd>GEARMORPH · AURION</dd></div>
          <div><dt>СКИН</dt><dd>{profile.skinUrl ? `УСТАНОВЛЕН · ${profile.skinModel === "slim" ? "ТОНКИЕ РУКИ" : "ОБЫЧНЫЕ РУКИ"}` : "НЕ УСТАНОВЛЕН"}</dd></div>
        </dl><div className="profile-actions"><Link href="/#worlds">ВЫБРАТЬ МИР →</Link><button onClick={logout}>ВЫЙТИ</button></div></div>
      </div>
      <section className="profile-ledger"><header><p>ACCOUNT LEDGER / LIVE HISTORY</p><h2>ДОНАТ И<br />ДЕЙСТВИЯ</h2></header><div className="ledger-grid">
        <article><div className="ledger-title"><span>01</span><h3>ДОНАТ</h3></div>{donations.length ? <ul>{donations.map((item, index) => <li key={`${item.createdAt}-${index}`}><div><b>{item.title}</b><small>{dateTime.format(item.createdAt)}</small></div><strong>{new Intl.NumberFormat("ru-RU", { style: "currency", currency: item.currency }).format(item.amountMinor / 100)}</strong></li>)}</ul> : <div className="ledger-empty"><b>ПОКА ПУСТО</b><p>Покупки и поддержка проекта появятся здесь.</p></div>}</article>
        <article><div className="ledger-title"><span>02</span><h3>ВХОДЫ И ДЕЙСТВИЯ</h3></div>{activity.length ? <ul>{activity.map((item, index) => <li key={`${item.createdAt}-${index}`}><div><b>{item.detail}</b><small>{item.source.toUpperCase()} · {dateTime.format(item.createdAt)}</small></div><i>{item.kind === "login" ? "ВХОД" : "ИЗМЕНЕНИЕ"}</i></li>)}</ul> : <div className="ledger-empty"><b>ИСТОРИЯ НАЧИНАЕТСЯ СЕЙЧАС</b><p>Здесь будут входы через сайт и лаунчер, а также изменения скина.</p></div>}</article>
      </div></section>
    </>}
  </section></main>;
}
