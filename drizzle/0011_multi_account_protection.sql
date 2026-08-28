CREATE TABLE IF NOT EXISTS account_device_links (
  device_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_account_device_links_user ON account_device_links(user_id);

CREATE TABLE IF NOT EXISTS account_security_events (
  id TEXT PRIMARY KEY,
  device_hash TEXT,
  ip_hash TEXT,
  event TEXT NOT NULL,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_account_security_events_ip_time ON account_security_events(ip_hash,created_at);
CREATE INDEX IF NOT EXISTS idx_account_security_events_device_time ON account_security_events(device_hash,created_at);

ALTER TABLE email_verification_codes ADD COLUMN device_hash TEXT;
ALTER TABLE email_verification_codes ADD COLUMN ip_hash TEXT;
