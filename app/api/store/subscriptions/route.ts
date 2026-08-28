import { env } from "cloudflare:workers";
import { safeJson } from "../../../../db/store";
export async function GET(){const plans=await env.DB.prepare("SELECT * FROM subscription_plans WHERE active=1 ORDER BY sort_order").all<Record<string,string|number|null>>();const links=await env.DB.prepare("SELECT plan_id,product_id FROM plan_products").all<{plan_id:string;product_id:string}>();return Response.json({plans:plans.results.map(p=>({...p,benefits:safeJson(String(p.benefits_json??"[]")),includedProducts:links.results.filter(x=>x.plan_id===p.id).map(x=>x.product_id)}))})}
