"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { SiteHeader } from "../components";
import { CosmeticCards, SubscriptionCards } from "../subscription-cards";
import { SkinViewer3D } from "./skin-viewer";

type SkinModel = "default" | "slim";
type NameStyleMode = "NONE" | "COLOR" | "GRADIENT" | "RAINBOW";
type NameGlyph = "DEFAULT" | "PRIME_CIRCUIT" | "PRIME_ARCANE";
type Profile = { email: string; minecraftNick: string; skinUrl?: string | null; skinModel: SkinModel; activeNameColor: string; nameStyleMode: NameStyleMode; nameStyleSecondary: string; nameGlyph: NameGlyph; isAdmin?: boolean };
type Activity = { kind: string; detail: string; source: string; createdAt: number };
type Donation = { title: string; amountMinor: number; currency: string; status: string; createdAt: number };
type Tag={id:string;display_text:string;prefix:string;suffix:string;color:string};
type Cosmetics={entitlements:{nameStyles:{color:boolean;gradient:boolean;rainbow:boolean};glyph:boolean;tags:Tag[]};current:{mode:NameStyleMode;color:string;gradient:{stops:{color:string;position:number}[];smooth:boolean;direction:string}|null;rainbow:{speed:number;saturation:number;brightness:number;direction:string}|null;activeTag:string|null}};
const dateTime = new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" });

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [nameColor, setNameColor] = useState("#FFFFFF");
  const [nameColorSecondary, setNameColorSecondary] = useState("#7C3CFF");
  const [nameStyleMode, setNameStyleMode] = useState<NameStyleMode>("NONE");
  const [nameGlyph, setNameGlyph] = useState<NameGlyph>("DEFAULT");
  const [cosmetics,setCosmetics]=useState<Cosmetics|null>(null);
  const [gradientStops,setGradientStops]=useState([{color:"#FFD17A",enabled:true},{color:"#F27A3D",enabled:false},{color:"#E8321C",enabled:true},{color:"#8B5CF6",enabled:false},{color:"#20D6FF",enabled:false}]);
  const [smooth,setSmooth]=useState(true);const [direction,setDirection]=useState<"LEFT_TO_RIGHT"|"RIGHT_TO_LEFT">("LEFT_TO_RIGHT");
  const [rainbow,setRainbow]=useState({speed:1,saturation:.78,brightness:1,direction:"LEFT_TO_RIGHT"});
  const [nicknameDraft,setNicknameDraft]=useState("");

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
        setProfile({ ...result.user, skinModel: result.user.skinModel ?? "default", activeNameColor: result.user.activeNameColor ?? "#FFFFFF", nameStyleMode: result.user.nameStyleMode ?? "NONE", nameStyleSecondary: result.user.nameStyleSecondary ?? "#7C3CFF", nameGlyph: result.user.nameGlyph ?? "DEFAULT" });
        setNameColor(result.user.activeNameColor ?? "#FFFFFF");
        setNameColorSecondary(result.user.nameStyleSecondary ?? "#7C3CFF");
        setNameStyleMode(result.user.nameStyleMode ?? "NONE");
        setNameGlyph(result.user.nameGlyph ?? "DEFAULT");
        setNicknameDraft(result.user.minecraftNick);
        fetch("/api/profile/cosmetics",{cache:"no-store"}).then(r=>r.json() as Promise<Cosmetics>).then(data=>{setCosmetics(data);setNameStyleMode(data.current.mode);setNameColor(data.current.color);if(data.current.gradient){setSmooth(data.current.gradient.smooth);setDirection(data.current.gradient.direction as "LEFT_TO_RIGHT"|"RIGHT_TO_LEFT");setGradientStops(old=>old.map((stop,index)=>data.current.gradient!.stops[index]?{color:data.current.gradient!.stops[index].color,enabled:true}:{...stop,enabled:false}))}if(data.current.rainbow)setRainbow(data.current.rainbow as typeof rainbow)});
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

  async function saveNickname() {
    if (!profile?.isAdmin) return;
    setMessage("ПРОВЕРЯЕМ И СОХРАНЯЕМ НИК…");
    const response = await fetch("/api/profile/nickname", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ minecraftNick: nicknameDraft }) });
    const result = await response.json() as { error?: string; minecraftNick?: string };
    if (!response.ok) return setMessage(result.error ?? "Не удалось изменить ник.");
    const minecraftNick = result.minecraftNick ?? nicknameDraft;
    setProfile(current => current ? { ...current, minecraftNick } : current);
    setNicknameDraft(minecraftNick);
    setMessage("НИК СОХРАНЁН · ПЕРЕЗАЙДИТЕ В ЛАУНЧЕР И НА СЕРВЕР");
    await refreshOverview();
  }

  async function saveNameStyle() {
    setMessage("СОХРАНЯЕМ ОФОРМЛЕНИЕ НИКА…");
    const activeStops=gradientStops.filter(s=>s.enabled);const response = await fetch("/api/profile/name-style", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: nameStyleMode, primary: nameColor, secondary: nameColorSecondary, glyph: nameGlyph,gradient:{stops:activeStops.map((s,i)=>({color:s.color,position:i/(activeStops.length-1)})),smooth,direction},rainbow }) });
    const result = await response.json() as { error?: string; activeNameColor?: string; nameStyleMode?: NameStyleMode; nameStyleSecondary?: string; nameGlyph?: NameGlyph };
    if (!response.ok) return setMessage(result.error ?? "Не удалось сохранить оформление. Проверьте подписку или покупку.");
    setProfile(current => current ? { ...current, activeNameColor: result.activeNameColor ?? nameColor, nameStyleMode: result.nameStyleMode ?? nameStyleMode, nameStyleSecondary: result.nameStyleSecondary ?? nameColorSecondary, nameGlyph: result.nameGlyph ?? nameGlyph } : current);
    setMessage("ОФОРМЛЕНИЕ СОХРАНЕНО · В MINECRAFT ПОСЛЕ ПЕРЕЗАХОДА");
    await refreshOverview();
  }
  async function saveTag(activeTag:string|null){const response=await fetch("/api/profile/cosmetics",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({activeTag})});const result=await response.json() as {error?:string};if(!response.ok)return setMessage(result.error??"Не удалось выбрать тег");setCosmetics(current=>current?{...current,current:{...current.current,activeTag}}:current);setMessage("ТЕГ СОХРАНЁН · ОБНОВИТЕ КОСМЕТИКУ В ИГРЕ")}

  const activeStops=gradientStops.filter(s=>s.enabled);const gradientCss=`linear-gradient(${direction==="RIGHT_TO_LEFT"?"270deg":"90deg"},${activeStops.map(s=>s.color).join(",")})`;const previewStyle = nameStyleMode === "COLOR" ? { color: nameColor } : nameStyleMode === "GRADIENT" ? { backgroundImage: gradientCss } : undefined;
  const decoratedNick = nameGlyph === "PRIME_CIRCUIT" ? `◇ ${profile?.minecraftNick ?? ""} ◇` : nameGlyph === "PRIME_ARCANE" ? `✦ ${profile?.minecraftNick ?? ""} ✦` : profile?.minecraftNick ?? "";

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
        <div className="profile-data"><span>АКТИВНЫЙ ИГРОК</span><h2 className={`name-style-preview ${profile.nameStyleMode.toLowerCase()}`} style={profile.nameStyleMode === "COLOR" ? { color: profile.activeNameColor } : undefined}>{profile.minecraftNick}</h2><dl>
          {profile.isAdmin && <div className="nickname-owner-editor"><dt>НИК MINECRAFT · ВЛАДЕЛЕЦ</dt><dd><input value={nicknameDraft} maxLength={16} pattern="[A-Za-z0-9_]{3,16}" onChange={event => setNicknameDraft(event.target.value)} /><button disabled={!/^[A-Za-z0-9_]{3,16}$/.test(nicknameDraft) || nicknameDraft === profile.minecraftNick} onClick={saveNickname}>СОХРАНИТЬ НИК</button><small>Изменятся профиль, лаунчер, UUID и whitelist. Новый ник появится после повторного входа.</small></dd></div>}
          <div><dt>ПОДТВЕРЖДЁННАЯ ПОЧТА</dt><dd>{profile.email}</dd></div><div><dt>ДОСТУПНЫЕ МИРЫ</dt><dd>GEARMORPH · AURION</dd></div>
          <div><dt>СКИН</dt><dd>{profile.skinUrl ? `УСТАНОВЛЕН · ${profile.skinModel === "slim" ? "ТОНКИЕ РУКИ" : "ОБЫЧНЫЕ РУКИ"}` : "НЕ УСТАНОВЛЕН"}</dd></div>
          {cosmetics&&(cosmetics.entitlements.nameStyles.color||cosmetics.entitlements.nameStyles.gradient||cosmetics.entitlements.nameStyles.rainbow)?<div className="name-color-editor"><dt>ОФОРМЛЕНИЕ НИКА · КОСМЕТИКА</dt><dd>
            <div className={`name-color-preview name-style-preview ${nameStyleMode.toLowerCase()}`} style={previewStyle}>{decoratedNick}</div>
            <div className="name-style-modes">{([cosmetics.entitlements.nameStyles.color&&"COLOR",cosmetics.entitlements.nameStyles.gradient&&"GRADIENT",cosmetics.entitlements.nameStyles.rainbow&&"RAINBOW"].filter(Boolean) as NameStyleMode[]).map(mode => <button key={mode} className={nameStyleMode === mode ? "active" : ""} onClick={() => setNameStyleMode(mode)}>{mode === "COLOR" ? "ЦВЕТ" : mode === "GRADIENT" ? "ГРАДИЕНТ" : "РАДУГА"}</button>)}</div>
            {nameStyleMode==="COLOR"&&<label>HEX<input type="text" value={nameColor} maxLength={7} pattern="#?[0-9A-Fa-f]{6}" onChange={event => setNameColor((event.target.value.startsWith("#")?event.target.value:`#${event.target.value}`).toUpperCase())} /><input type="color" value={/^#[0-9A-F]{6}$/.test(nameColor) ? nameColor : "#FFFFFF"} onChange={event => setNameColor(event.target.value.toUpperCase())} /></label>}
            {nameStyleMode==="GRADIENT"&&<div className="gradient-editor"><div className="gradient-strip" style={{background:gradientCss}} />{gradientStops.map((stop,index)=><div className="gradient-stop" key={index}><input type="checkbox" checked={stop.enabled} disabled={stop.enabled&&activeStops.length<=2} onChange={event=>setGradientStops(items=>items.map((item,i)=>i===index?{...item,enabled:event.target.checked}:item))}/><span>ЦВЕТ {index+1}</span><input type="text" value={stop.color} disabled={!stop.enabled} onChange={event=>setGradientStops(items=>items.map((item,i)=>i===index?{...item,color:event.target.value.toUpperCase()}:item))}/><input type="color" value={stop.color} disabled={!stop.enabled} onChange={event=>setGradientStops(items=>items.map((item,i)=>i===index?{...item,color:event.target.value.toUpperCase()}:item))}/></div>)}<label><input type="checkbox" checked={smooth} onChange={event=>setSmooth(event.target.checked)}/> ПЛАВНЫЙ ГРАДИЕНТ</label><button onClick={()=>setDirection(direction==="LEFT_TO_RIGHT"?"RIGHT_TO_LEFT":"LEFT_TO_RIGHT")}>{direction==="LEFT_TO_RIGHT"?"СЛЕВА НАПРАВО":"СПРАВА НАЛЕВО"}</button></div>}
            {nameStyleMode==="RAINBOW"&&<div className="rainbow-editor"><label>СКОРОСТЬ<input type="range" min="0.1" max="5" step="0.1" value={rainbow.speed} onChange={e=>setRainbow({...rainbow,speed:Number(e.target.value)})}/></label><label>НАСЫЩЕННОСТЬ<input type="range" min="0.2" max="1" step="0.05" value={rainbow.saturation} onChange={e=>setRainbow({...rainbow,saturation:Number(e.target.value)})}/></label><label>ЯРКОСТЬ<input type="range" min="0.2" max="1" step="0.05" value={rainbow.brightness} onChange={e=>setRainbow({...rainbow,brightness:Number(e.target.value)})}/></label></div>}
            {cosmetics.entitlements.glyph&&<div className="name-glyphs"><span>PRIME GLYPH STUDIO</span>{(["DEFAULT","PRIME_CIRCUIT","PRIME_ARCANE"] as NameGlyph[]).map(glyph => <button key={glyph} className={nameGlyph === glyph ? "active" : ""} onClick={() => setNameGlyph(glyph)}>{glyph === "DEFAULT" ? "БЕЗ ЗНАКА" : glyph === "PRIME_CIRCUIT" ? "◇ CIRCUIT" : "✦ ARCANE"}</button>)}</div>}
            <button className="save-name-style" disabled={!/^#[0-9A-F]{6}$/.test(nameColor)||activeStops.length<2} onClick={saveNameStyle}>СОХРАНИТЬ ОФОРМЛЕНИЕ</button>
          </dd></div>:<div className="no-name-cosmetics"><p>У вас пока нет косметики для ника.</p><Link href="/donate">ПЕРЕЙТИ В МАГАЗИН →</Link></div>}
          {cosmetics&&cosmetics.entitlements.tags.length>0&&<div className="tag-editor"><dt>ТЕГ</dt><dd><button className={!cosmetics.current.activeTag?"active":""} onClick={()=>saveTag(null)}>БЕЗ ТЕГА</button>{cosmetics.entitlements.tags.map(tag=><button key={tag.id} className={cosmetics.current.activeTag===tag.id?"active":""} style={{color:tag.color}} onClick={()=>saveTag(tag.id)}>{tag.prefix}{tag.display_text}{tag.suffix}</button>)}</dd></div>}
        </dl><div className="profile-actions"><Link href="/#worlds">ВЫБРАТЬ МИР →</Link><button onClick={logout}>ВЫЙТИ</button></div></div>
      </div>
      <section className="profile-ledger"><header><p>ACCOUNT SUPPORT</p><h2>ДОНАТ</h2></header><SubscriptionCards compact /><CosmeticCards /><div className="ledger-single">
        <article><div className="ledger-title"><span>01</span><h3>ДОНАТ</h3></div>{donations.length ? <ul>{donations.map((item, index) => <li key={`${item.createdAt}-${index}`}><div><b>{item.title}</b><small>{dateTime.format(item.createdAt)}</small></div><strong>{new Intl.NumberFormat("ru-RU", { style: "currency", currency: item.currency }).format(item.amountMinor / 100)}</strong></li>)}</ul> : <div className="ledger-empty"><b>ПОКА ПУСТО</b><p>Покупки и поддержка проекта появятся здесь.</p></div>}</article>
      </div></section><section className="profile-ledger profile-activity"><header><p>ACCOUNT LIVE HISTORY</p><h2>ДЕЙСТВИЯ</h2></header><div className="ledger-single">
        <article><div className="ledger-title"><span>02</span><h3>ВХОДЫ И ДЕЙСТВИЯ</h3></div>{activity.length ? <ul>{activity.map((item, index) => <li key={`${item.createdAt}-${index}`}><div><b>{item.detail}</b><small>{item.source.toUpperCase()} · {dateTime.format(item.createdAt)}</small></div><i>{item.kind === "login" ? "ВХОД" : "ИЗМЕНЕНИЕ"}</i></li>)}</ul> : <div className="ledger-empty"><b>ИСТОРИЯ НАЧИНАЕТСЯ СЕЙЧАС</b><p>Здесь будут входы через сайт и лаунчер, а также изменения скина.</p></div>}</article>
      </div></section>
    </>}
  </section></main>;
}
