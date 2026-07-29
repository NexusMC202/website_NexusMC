CREATE TABLE `telegram_links` (
	`telegram_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`minecraft_nick` text NOT NULL,
	`linked_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `telegram_links_user_id_unique` ON `telegram_links` (`user_id`);--> statement-breakpoint
CREATE TABLE `telegram_login_challenges` (
	`id` text PRIMARY KEY NOT NULL,
	`code_hash` text NOT NULL,
	`minecraft_nick` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`telegram_id` text,
	`user_id` text,
	`expires_at` integer NOT NULL,
	`created_at` integer NOT NULL,
	`confirmed_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `telegram_login_challenges_code_hash_unique` ON `telegram_login_challenges` (`code_hash`);