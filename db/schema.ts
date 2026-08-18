import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  minecraftNick: text("minecraft_nick").notNull(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  createdAt: integer("created_at").notNull(),
  skinKey: text("skin_key"),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  remainingEntries: integer("remaining_entries").notNull().default(2),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at").notNull(),
});

export const telegramLoginChallenges = sqliteTable("telegram_login_challenges", {
  id: text("id").primaryKey(),
  codeHash: text("code_hash").notNull().unique(),
  minecraftNick: text("minecraft_nick").notNull(),
  status: text("status").notNull().default("pending"),
  telegramId: text("telegram_id"),
  userId: text("user_id"),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at").notNull(),
  confirmedAt: integer("confirmed_at"),
});

export const telegramLinks = sqliteTable("telegram_links", {
  telegramId: text("telegram_id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  minecraftNick: text("minecraft_nick").notNull(),
  linkedAt: integer("linked_at").notNull(),
});
