ALTER TABLE users ADD COLUMN name_style_mode TEXT NOT NULL DEFAULT 'DEFAULT';
ALTER TABLE users ADD COLUMN name_style_secondary TEXT;
ALTER TABLE users ADD COLUMN name_glyph TEXT NOT NULL DEFAULT 'DEFAULT';
CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY,type TEXT NOT NULL,display_name TEXT NOT NULL,description TEXT NOT NULL,price_minor INTEGER NOT NULL,currency TEXT NOT NULL DEFAULT 'KGS',entitlement_key TEXT NOT NULL,available INTEGER NOT NULL DEFAULT 1);
CREATE TABLE IF NOT EXISTS user_entitlements (id TEXT PRIMARY KEY,user_id TEXT NOT NULL,entitlement_key TEXT NOT NULL,source TEXT NOT NULL,expires_at INTEGER,created_at INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS idx_user_entitlements_active ON user_entitlements(user_id,entitlement_key,expires_at);
INSERT OR IGNORE INTO products VALUES
 ('name_color_custom','NAME_STYLE','Свой цвет ника','Безопасный HEX-цвет для профиля и Minecraft TAB',14900,'KGS','NAME_COLOR_CUSTOM',1),
 ('name_gradient','NAME_STYLE','Градиентный ник','Плавный переход между двумя цветами',24900,'KGS','NAME_GRADIENT',1),
 ('name_rainbow','NAME_STYLE','Радужный ник','Переливающийся радужный ник в TAB',34900,'KGS','NAME_RAINBOW',1),
 ('name_glyph_prime','NAME_GLYPH','Prime Glyph Studio','Официальные варианты оформления букв',29900,'KGS','NAME_GLYPH',1);
