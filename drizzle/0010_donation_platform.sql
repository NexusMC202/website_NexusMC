ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN active_background TEXT;
ALTER TABLE users ADD COLUMN active_frame TEXT;

ALTER TABLE products ADD COLUMN category TEXT NOT NULL DEFAULT 'Name Colors';
ALTER TABLE products ADD COLUMN rarity TEXT NOT NULL DEFAULT 'COMMON';
ALTER TABLE products ADD COLUMN permanent INTEGER NOT NULL DEFAULT 1;
ALTER TABLE products ADD COLUMN status TEXT NOT NULL DEFAULT 'AVAILABLE';
ALTER TABLE products ADD COLUMN asset_id TEXT;
ALTER TABLE products ADD COLUMN metadata_json TEXT NOT NULL DEFAULT '{}';
ALTER TABLE products ADD COLUMN starts_at INTEGER;
ALTER TABLE products ADD COLUMN ends_at INTEGER;
ALTER TABLE products ADD COLUMN sort_order INTEGER NOT NULL DEFAULT 0;

ALTER TABLE subscription_plans ADD COLUMN name TEXT;
ALTER TABLE subscription_plans ADD COLUMN badge TEXT;
ALTER TABLE subscription_plans ADD COLUMN accent_color TEXT;
ALTER TABLE subscription_plans ADD COLUMN benefits_json TEXT NOT NULL DEFAULT '[]';

CREATE TABLE IF NOT EXISTS orders (
 id TEXT PRIMARY KEY,user_id TEXT NOT NULL,product_id TEXT,plan_id TEXT,amount_minor INTEGER NOT NULL,
 currency TEXT NOT NULL,status TEXT NOT NULL,payment_provider TEXT NOT NULL,provider_payment_id TEXT,
 created_at INTEGER NOT NULL,paid_at INTEGER,refunded_at INTEGER,metadata_json TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_orders_user_created ON orders(user_id,created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_provider_payment ON orders(payment_provider,provider_payment_id) WHERE provider_payment_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS entitlements (
 id TEXT PRIMARY KEY,user_id TEXT NOT NULL,type TEXT NOT NULL,resource_id TEXT NOT NULL,source TEXT NOT NULL,
 source_id TEXT,granted_at INTEGER NOT NULL,expires_at INTEGER,revoked_at INTEGER,metadata_json TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_entitlements_user_active ON entitlements(user_id,type,resource_id,expires_at,revoked_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_entitlements_source ON entitlements(user_id,type,resource_id,source,source_id) WHERE source_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS plan_products (plan_id TEXT NOT NULL,product_id TEXT NOT NULL,PRIMARY KEY(plan_id,product_id));
CREATE TABLE IF NOT EXISTS cosmetic_assets (
 id TEXT PRIMARY KEY,kind TEXT NOT NULL,path TEXT NOT NULL,mime_type TEXT NOT NULL,width INTEGER,height INTEGER,
 status TEXT NOT NULL DEFAULT 'PLACEHOLDER',created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS payment_events (
 id TEXT PRIMARY KEY,provider TEXT NOT NULL,event_id TEXT NOT NULL,provider_payment_id TEXT,event_type TEXT NOT NULL,
 payload_hash TEXT NOT NULL,processed_at INTEGER NOT NULL,order_id TEXT,status TEXT NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_events_provider_event ON payment_events(provider,event_id);
CREATE TABLE IF NOT EXISTS store_audit_log (
 id TEXT PRIMARY KEY,actor_user_id TEXT,action TEXT NOT NULL,target_type TEXT NOT NULL,target_id TEXT NOT NULL,
 detail_json TEXT NOT NULL DEFAULT '{}',created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_store_audit_created ON store_audit_log(created_at DESC);
CREATE TABLE IF NOT EXISTS api_rate_limits (key TEXT PRIMARY KEY,window_start INTEGER NOT NULL,count INTEGER NOT NULL);

UPDATE users SET is_admin=1 WHERE lower(minecraft_nick)='isus_hrestos';
UPDATE subscription_plans SET name=upper(replace(display_name,'NEXUS ','')),
 badge=CASE id WHEN 'supporter' THEN 'STARTER' WHEN 'plus' THEN 'POPULAR' WHEN 'prime' THEN 'PREMIUM' ELSE 'LEGENDARY' END,
 accent_color=CASE id WHEN 'supporter' THEN '#20D6FF' WHEN 'plus' THEN '#8B5CF6' WHEN 'prime' THEN '#F2B84B' ELSE '#FF5364' END,
 benefits_json=CASE id
 WHEN 'supporter' THEN '["Бейдж Supporter","Стартовые цвета ника","Базовые фоны профиля"]'
 WHEN 'plus' THEN '["Цвета ника","Фоны профиля","Рамки профиля"]'
 WHEN 'prime' THEN '["Градиентный ник","Премиальные фоны","Prime Glyph Studio"]'
 ELSE '["Радужный ник","Полный косметический набор","Сезонные награды"]' END;

INSERT OR REPLACE INTO products (id,type,display_name,description,price_minor,currency,entitlement_key,available,category,rarity,permanent,status,metadata_json,sort_order) VALUES
 ('name_color_red','NAME_COLOR','Red','Красное оформление ника',9900,'KGS','NAME_COLOR',1,'Name Colors','COMMON',1,'AVAILABLE','{"color":"#E8321C"}',10),
 ('name_color_purple','NAME_COLOR','Purple','Фиолетовое оформление ника',9900,'KGS','NAME_COLOR',1,'Name Colors','RARE',1,'AVAILABLE','{"color":"#8B5CF6"}',11),
 ('name_color_cyan','NAME_COLOR','Cyan','Бирюзовое оформление ника',9900,'KGS','NAME_COLOR',1,'Name Colors','RARE',1,'AVAILABLE','{"color":"#20D6FF"}',12),
 ('name_color_gold','NAME_COLOR','Gold','Золотое оформление ника',14900,'KGS','NAME_COLOR',1,'Name Colors','EPIC',1,'AVAILABLE','{"color":"#FFD17A"}',13),
 ('name_color_custom','NAME_COLOR','Свой цвет ника','Любой безопасный HEX-цвет',14900,'KGS','NAME_COLOR_CUSTOM',1,'Name Colors','EPIC',1,'AVAILABLE','{}',14),
 ('name_gradient','NAME_GRADIENT','Градиентный ник','Редактор градиента из 2–5 цветов',24900,'KGS','NAME_GRADIENT',1,'Name Gradients','EPIC',1,'AVAILABLE','{}',20),
 ('name_rainbow','NAME_RAINBOW','Радужный ник','Анимированное радужное оформление',34900,'KGS','NAME_RAINBOW',1,'Name Gradients','LEGENDARY',1,'AVAILABLE','{}',21),
 ('background_mechanical','PROFILE_BACKGROUND','Mechanical Core','Механический фон профиля',14900,'KGS','PROFILE_BACKGROUND',1,'Profile Backgrounds','EPIC',1,'COMING_SOON','{"placeholder":true,"theme":"mechanical"}',30),
 ('background_arcane','PROFILE_BACKGROUND','Arcane','Магический фон профиля',14900,'KGS','PROFILE_BACKGROUND',1,'Profile Backgrounds','EPIC',1,'COMING_SOON','{"placeholder":true,"theme":"arcane"}',31),
 ('background_dark','PROFILE_BACKGROUND','Dark','Тёмный фон профиля',9900,'KGS','PROFILE_BACKGROUND',1,'Profile Backgrounds','COMMON',1,'AVAILABLE','{"type":"GRADIENT","gradient":"linear-gradient(135deg,#05070d,#121b31)"}',32),
 ('background_season2','PROFILE_BACKGROUND','Season 2','Сезонный фон второго сезона',19900,'KGS','PROFILE_BACKGROUND',1,'Seasonal','SEASONAL',1,'COMING_SOON','{"placeholder":true,"season":2}',33),
 ('tag_mol','CUSTOM_TAG','МОЛ','Тег {МОЛ} перед ником',19900,'KGS','CUSTOM_TAG',1,'Tags','EPIC',1,'AVAILABLE','{"tagId":"mol"}',40),
 ('badge_supporter','PROFILE_BADGE','Supporter','Бейдж поддержки проекта',9900,'KGS','PROFILE_BADGE',1,'Badges','COMMON',1,'AVAILABLE','{"badge":"SUPPORTER"}',50);

INSERT OR IGNORE INTO plan_products VALUES
 ('supporter','badge_supporter'),('supporter','name_color_red'),('supporter','background_dark'),
 ('plus','badge_supporter'),('plus','name_color_custom'),('plus','background_dark'),
 ('prime','badge_supporter'),('prime','name_color_custom'),('prime','name_gradient'),('prime','background_dark'),
 ('legend','badge_supporter'),('legend','name_color_custom'),('legend','name_gradient'),('legend','name_rainbow'),('legend','background_dark'),('legend','tag_mol');
