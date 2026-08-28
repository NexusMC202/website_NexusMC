ALTER TABLE users ADD COLUMN minecraft_uuid TEXT;
ALTER TABLE users ADD COLUMN name_gradient_json TEXT;
ALTER TABLE users ADD COLUMN name_rainbow_json TEXT;
ALTER TABLE users ADD COLUMN active_tag TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_minecraft_uuid ON users(minecraft_uuid);
CREATE TABLE IF NOT EXISTS cosmetic_tags (id TEXT PRIMARY KEY,display_text TEXT NOT NULL,prefix TEXT NOT NULL DEFAULT '{',suffix TEXT NOT NULL DEFAULT '}',color TEXT NOT NULL,source TEXT NOT NULL DEFAULT 'SYSTEM',available INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS user_tags (user_id TEXT NOT NULL,tag_id TEXT NOT NULL,source TEXT NOT NULL,expires_at INTEGER,created_at INTEGER NOT NULL,PRIMARY KEY(user_id,tag_id));
INSERT OR IGNORE INTO cosmetic_tags VALUES
 ('mol','МОЛ','{','}','#8B5CF6','PURCHASE',1),
 ('vip','VIP','{','}','#FFD36A','PURCHASE',1),
 ('og','OG','{','}','#20D6FF','EVENT',1),
 ('builder','BUILDER','{','}','#55DCA1','STAFF',1),
 ('creator','CREATOR','{','}','#FF5FA2','SYSTEM',1);
