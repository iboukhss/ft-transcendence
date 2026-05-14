ALTER TABLE "profiles" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "about" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "skills" "skillsEnum"[];