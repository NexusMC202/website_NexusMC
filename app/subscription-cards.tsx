"use client";

import { useEffect, useMemo, useState } from "react";

type Plan = { id:string; display_name:string; description:string; price_minor:number; currency:string; period:string; badge:string; accent_color:string; benefits:string[] };
type Product = { id:string; display_name:string; description:string; price_minor:number; currency:string; category:string; rarity:string; storeStatus:string; owned:boolean; metadata:Record<string,unknown> };
type DisplayCurrency = "KGS" | "RUB" | "USD" | "EUR";

const CURRENCIES: Array<{ id:DisplayCurrency; title:string }> = [
  { id:"KGS", title:"СОМ" }, { id:"RUB", title:"₽ RUB" }, { id:"USD", title:"$ USD" }, { id:"EUR", title:"€ EUR" },
];
const KGS_RATE: Record<DisplayCurrency, number> = { KGS:1, RUB:0.97, USD:0.0114, EUR:0.0098 };
const CATEGORY_NAMES: Record<string,string> = { ALL:"ВСЕ ТОВАРЫ", ВСЕ:"ВСЕ ТОВАРЫ", BADGES:"БЕЙДЖИ", NAME_COLORS:"ЦВЕТА НИКА", NAME_GRADIENTS:"ГРАДИЕНТЫ НИКА", PROFILE_BACKGROUNDS:"ФОНЫ ПРОФИЛЯ", SEASONAL:"СЕЗОННОЕ", TAGS:"ТЕГИ" };

function money(value:number, _sourceCurrency:string, target:DisplayCurrency) {
  const converted = value * KGS_RATE[target] / 100;
  return new Intl.NumberFormat("ru-RU", { style:"currency", currency:target, maximumFractionDigits:target === "KGS" || target === "RUB" ? 0 : 2 }).format(converted);
}

async function checkout(payload:Record<string,string>) {
  const response = await fetch("/api/store/checkout", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify(payload) });
  const data = await response.json() as { checkoutUrl?:string; message?:string; error?:string };
  if (response.status === 401) { location.href = "/login"; return; }
  if (data.checkoutUrl) { location.href = data.checkoutUrl; return; }
  throw new Error(data.message || data.error || "Не удалось начать оплату");
}

export function CurrencySelector({ value, onChange }:{ value:DisplayCurrency; onChange:(currency:DisplayCurrency)=>void }) {
  return <section className="store-toolbar" aria-label="Настройки магазина"><div><small>ВАЛЮТА МАГАЗИНА</small><strong>Цены во всех карточках</strong></div><label><span>ВАЛЮТА</span><select value={value} onChange={event=>onChange(event.target.value as DisplayCurrency)}>{CURRENCIES.map(currency=><option value={currency.id} key={currency.id}>{currency.title}</option>)}</select></label></section>;
}

export function StorefrontCards() {
  const [currency, setCurrency] = useState<DisplayCurrency>("KGS");
  useEffect(()=>{ const saved=localStorage.getItem("nexus-store-currency") as DisplayCurrency|null; if(saved&&CURRENCIES.some(item=>item.id===saved))setCurrency(saved); },[]);
  const change=(next:DisplayCurrency)=>{ setCurrency(next); localStorage.setItem("nexus-store-currency",next); };
  return <><CurrencySelector value={currency} onChange={change}/><SubscriptionCards currency={currency}/><CosmeticCards currency={currency}/></>;
}

export function SubscriptionCards({ compact=false, currency="KGS" }:{ compact?:boolean; currency?:DisplayCurrency }) {
  const [plans,setPlans]=useState<Plan[]>([]), [error,setError]=useState("");
  useEffect(()=>{ fetch("/api/store/subscriptions").then(r=>r.json()).then(d=>setPlans(d.plans||[])).catch(()=>setError("Каталог подписок временно недоступен")); },[]);
  return <div className={`subscription-grid ${compact?"compact":""}`}>{error&&<p>{error}</p>}{plans.map((plan,index)=><article className="subscription-card" style={{"--tone":plan.accent_color} as React.CSSProperties} key={plan.id}><span>{String(index+1).padStart(2,"0")}</span><div className="plan-gem">N</div><h2>{plan.display_name}</h2><strong>{money(plan.price_minor,plan.currency,currency)} / месяц</strong><p>{plan.description}</p><ul>{(plan.benefits||[]).map(item=><li key={item}>◇ {item}</li>)}</ul><em>{plan.badge}</em><button onClick={()=>checkout({planId:plan.id,billingPeriod:"MONTHLY"}).catch(e=>setError(e.message))}>ОФОРМИТЬ ↗</button></article>)}</div>;
}

export function CosmeticCards({ currency="KGS" }:{ currency?:DisplayCurrency }) {
  const [products,setProducts]=useState<Product[]>([]), [category,setCategory]=useState("ВСЕ"), [message,setMessage]=useState(""), [filterOpen,setFilterOpen]=useState(false);
  useEffect(()=>{ fetch("/api/store/products").then(r=>r.json()).then(d=>setProducts(d.products||[])).catch(()=>setMessage("Каталог временно недоступен")); },[]);
  const categories=useMemo(()=>["ВСЕ",...Array.from(new Set(products.map(p=>p.category)))],[products]);
  const visible=category==="ВСЕ"?products:products.filter(product=>product.category===category);
  const choose=(next:string)=>{ setCategory(next); setFilterOpen(false); };
  return <section className="cosmetic-store"><header><div><p>COSMETICS / ONE-TIME PURCHASE</p><h2>КОСМЕТИКА</h2></div><div className="store-filter-control"><button className={filterOpen?"active":""} onClick={()=>setFilterOpen(value=>!value)} aria-expanded={filterOpen}><b>▼</b> ФИЛЬТР <span>{CATEGORY_NAMES[category]||category}</span></button>{filterOpen&&<nav className="store-filter-menu">{categories.map(item=><button className={item===category?"active":""} onClick={()=>choose(item)} key={item}>{CATEGORY_NAMES[item]||item}</button>)}</nav>}</div></header>{message&&<p className="store-message">{message}</p>}<div>{visible.map(product=><article className={`rarity-${product.rarity.toLowerCase()}`} key={product.id}><small>{product.rarity} · {CATEGORY_NAMES[product.category]||product.category}</small><div className="product-preview" style={typeof product.metadata.gradient==="string"?{background:product.metadata.gradient}:undefined}/><h3>{product.display_name}</h3><p>{product.description}</p><strong>{money(product.price_minor,product.currency,currency)}</strong><button disabled={product.owned||product.storeStatus!=="AVAILABLE"} onClick={()=>checkout({productId:product.id}).catch(e=>setMessage(e.message))}>{product.owned?"КУПЛЕНО":product.storeStatus==="COMING_SOON"?"СКОРО":"КУПИТЬ ↗"}</button></article>)}</div></section>;
}
