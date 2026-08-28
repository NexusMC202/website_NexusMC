ALTER TABLE users ADD COLUMN active_name_color TEXT NOT NULL DEFAULT '#FFFFFF';

CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_minor INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'KGS',
  period TEXT NOT NULL DEFAULT 'MONTHLY',
  sort_order INTEGER NOT NULL DEFAULT 0,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  started_at INTEGER NOT NULL,
  current_period_end INTEGER NOT NULL,
  cancel_at_period_end INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

INSERT OR IGNORE INTO subscription_plans VALUES
 ('supporter','NEXUS SUPPORTER','Базовая поддержка проекта и значок Supporter',19900,'KGS','MONTHLY',10,1),
 ('plus','NEXUS PLUS','Расширенная косметика профиля и цвета ника',39900,'KGS','MONTHLY',20,1),
 ('prime','NEXUS PRIME','Премиальные фоны, рамки и сезонная косметика',69900,'KGS','MONTHLY',30,1),
 ('legend','NEXUS LEGEND','Максимальный косметический набор без игровых преимуществ',99900,'KGS','MONTHLY',40,1);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id, created_at DESC);
