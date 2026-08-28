"use client";
import { FormEvent,useEffect,useState } from "react";
import { SiteHeader } from "../../components";
type Product={id:string;display_name:string;category:string;price_minor:number;currency:string;status:string;rarity:string};
export default function AdminStore(){
 const [products,setProducts]=useState<Product[]>([]),[message,setMessage]=useState("");
 const load=()=>fetch("/api/admin/store/products").then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error);setProducts(d.products||[])}).catch(e=>setMessage(e.message));
 useEffect(()=>{void load()},[]);
 async function create(e:FormEvent<HTMLFormElement>){e.preventDefault();const form=e.currentTarget,f=new FormData(form),body=Object.fromEntries(f);body.priceMinor=String(Number(body.price)*100);const r=await fetch("/api/admin/store/products",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});const d=await r.json() as {error?:string};setMessage(r.ok?"Товар создан":d.error||"Ошибка");if(r.ok){form.reset();void load()}}
 return <main className="donate-page"><SiteHeader/><section className="account-store-page"><p>ADMIN / DONATION STORE</p><h1>УПРАВЛЕНИЕ МАГАЗИНОМ</h1><form className="admin-product-form" onSubmit={create}><input name="id" placeholder="product_id" required/><input name="displayName" placeholder="Название" required/><input name="type" placeholder="PROFILE_BACKGROUND" required/><input name="entitlementKey" placeholder="Entitlement key" required/><input name="category" placeholder="Profile Backgrounds" required/><input name="price" type="number" min="0" step="1" placeholder="Цена KGS" required/><select name="rarity"><option>COMMON</option><option>RARE</option><option>EPIC</option><option>LEGENDARY</option><option>SEASONAL</option></select><textarea name="description" placeholder="Описание"/><button>СОЗДАТЬ ТОВАР</button></form>{message&&<p className="store-message">{message}</p>}<article><h2>ТОВАРЫ</h2>{products.map(p=><div className="order-row" key={p.id}><b>{p.display_name}</b><span>{p.category}</span><strong>{p.status}</strong><small>{p.price_minor/100} {p.currency} · {p.rarity}</small></div>)}</article></section></main>
}
