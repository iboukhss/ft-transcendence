ALTER TABLE "offers" RENAME TO "jobs";--> statement-breakpoint
ALTER TABLE "jobs" RENAME COLUMN "work_place" TO "workplace";--> statement-breakpoint
ALTER TABLE "orders" RENAME COLUMN "offer_id" TO "job_id";--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "offers_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_offer_id_offers_id_fk";
--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;