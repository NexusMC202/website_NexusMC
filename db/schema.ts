import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  minecraftNick: text("minecraft_nick").notNull(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  createdAt: integer("created_at").notNull(),
  skinKey: text("skin_key"),
  skinModel: text("skin_model").notNull().default("default"),
  activeNameColor: text("active_name_color").notNull().default("#FFFFFF"),
  nameStyleMode: text("name_style_mode").notNull().default("DEFAULT"),
  nameStyleSecondary: text("name_style_secondary"),
  nameGlyph: text("name_glyph").notNull().default("DEFAULT"),
});

export const userActivity = sqliteTable("user_activity", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  kind: text("kind").notNull(),
  detail: text("detail").notNull(),
  source: text("source").notNull(),
  createdAt: integer("created_at").notNull(),
}, table => [index("idx_user_activity_user_created").on(table.userId, table.createdAt)]);

export const donations = sqliteTable("donations", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  amountMinor: integer("amount_minor").notNull(),
  currency: text("currency").notNull().default("RUB"),
  status: text("status").notNull().default("paid"),
  createdAt: integer("created_at").notNull(),
}, table => [index("idx_donations_user_created").on(table.userId, table.createdAt)]);

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  remainingEntries: integer("remaining_entries").notNull().default(2),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const emailVerificationCodes = sqliteTable("email_verification_codes", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  codeHash: text("code_hash").notNull(),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at").notNull(),
  deviceHash: text("device_hash"),
  ipHash: text("ip_hash"),
});

export const passwordResetCodes = sqliteTable("password_reset_codes", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  codeHash: text("code_hash").notNull(),
  attempts: integer("attempts").notNull().default(0),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const accountDeviceLinks = sqliteTable("account_device_links", {
  deviceHash: text("device_hash").primaryKey(),
  userId: text("user_id").notNull(),
  source: text("source").notNull(),
  createdAt: integer("created_at").notNull(),
  lastSeenAt: integer("last_seen_at").notNull(),
}, table => [index("idx_account_device_links_user").on(table.userId)]);

export const accountSecurityEvents = sqliteTable("account_security_events", {
  id: text("id").primaryKey(),
  deviceHash: text("device_hash"),
  ipHash: text("ip_hash"),
  event: text("event").notNull(),
  createdAt: integer("created_at").notNull(),
}, table => [
  index("idx_account_security_events_ip_time").on(table.ipHash, table.createdAt),
  index("idx_account_security_events_device_time").on(table.deviceHash, table.createdAt),
]);
