"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteHeader } from "../components";

type Profile = { email: string; minecraftNick: string };

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session", { cache: "no-store" })
      .then(async response => {
        if (!response.ok) {
          window.location.href = "/login";
          return null;
        }
        return response.json() as Promise<{ authenticated: boolean; user: Profile }>;
      })
      .then(result => {
        if (result?.authenticated) setProfile(result.user);
      })
      .finally(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    sessionStorage.removeItem("nexus-session-counted");
    window.location.href = "/";
  }

  return <main className="profile-page">
    <SiteHeader />
    <section className="profile-card">
      <p>PLAYER IDENTITY / NEXUS</p>
      <h1>ПРОФИЛЬ</h1>
      {loading && <div className="profile-loading">ЗАГРУЗКА…</div>}
      {profile && <>
        <div className="profile-avatar">{profile.minecraftNick.slice(0, 1).toUpperCase()}</div>
        <dl>
          <div><dt>MINECRAFT-НИК</dt><dd>{profile.minecraftNick}</dd></div>
          <div><dt>ЭЛЕКТРОННАЯ ПОЧТА</dt><dd>{profile.email.endsWith(".invalid") ? "Вход через Telegram" : profile.email}</dd></div>
          <div><dt>СТАТУС</dt><dd><i /> УЧАСТНИК NEXUS</dd></div>
        </dl>
        <div className="profile-actions">
          <Link href="/world">ИССЛЕДОВАТЬ МИР →</Link>
          <button onClick={logout}>ВЫЙТИ</button>
        </div>
      </>}
    </section>
  </main>;
}
