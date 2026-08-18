"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { SiteHeader } from "../components";

type Profile = { email: string; minecraftNick: string; skinUrl?: string | null };

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" }).then(async response => {
      if (!response.ok) { window.location.href = "/login"; return null; }
      return response.json() as Promise<{ authenticated: boolean; user: Profile }>;
    }).then(result => { if (result?.authenticated) setProfile(result.user); }).finally(() => setLoading(false));
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
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return <main className="profile-page reform-profile">
    <SiteHeader />
    <section className="profile-reform-shell">
      <div className="profile-heading"><p>PLAYER IDENTITY / NEXUS NETWORK</p><h1>ЛИЧНОЕ<br />ДЕЛО</h1></div>
      {loading && <div className="profile-loading">ЗАГРУЗКА…</div>}
      {profile && <div className="profile-reform-card">
        <div className="skin-stage">
          {profile.skinUrl ? <img src={profile.skinUrl} alt={`Скин ${profile.minecraftNick}`} /> : <div className="skin-placeholder">{profile.minecraftNick.slice(0, 1).toUpperCase()}</div>}
          <label htmlFor="profileSkin">ЗАМЕНИТЬ СКИН</label>
          <input id="profileSkin" type="file" accept="image/png" onChange={uploadSkin} />
          {message && <small>{message}</small>}
        </div>
        <div className="profile-data"><span>АКТИВНЫЙ ИГРОК</span><h2>{profile.minecraftNick}</h2><dl>
          <div><dt>УЧЁТНАЯ ЗАПИСЬ</dt><dd>{profile.email.endsWith(".invalid") ? "Telegram ID" : profile.email}</dd></div>
          <div><dt>ДОСТУПНЫЕ МИРЫ</dt><dd>GEARMORPH · AURION</dd></div>
          <div><dt>СКИН</dt><dd>{profile.skinUrl ? "УСТАНОВЛЕН" : "НЕ УСТАНОВЛЕН"}</dd></div>
        </dl><div className="profile-actions"><Link href="/#worlds">ВЫБРАТЬ МИР →</Link><button onClick={logout}>ВЫЙТИ</button></div></div>
      </div>}
    </section>
  </main>;
}
