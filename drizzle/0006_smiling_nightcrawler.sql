CREATE INDEX `idx_donations_user_created` ON `donations` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `idx_user_activity_user_created` ON `user_activity` (`user_id`,`created_at`);