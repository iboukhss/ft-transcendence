CREATE TYPE "public"."jobStatusEnum" AS ENUM('active', 'paused', 'deleted', 'booked');--> statement-breakpoint
ALTER TYPE "public"."orderStatusEnum" RENAME TO "bookingStatusEnum";--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"buyer_id" integer NOT NULL,
	"seller_id" integer NOT NULL,
	"price" real NOT NULL,
	"hourly_rate" real NOT NULL,
	"duration" integer NOT NULL,
	"proposed_workplace" "workPlaceEnum",
	"status" "bookingStatusEnum" DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer NOT NULL,
	"buyer_id" integer NOT NULL,
	"seller_id" integer NOT NULL,
	"status" "offerStatusEnum" DEFAULT 'pending' NOT NULL,
	"motivation_letter" text NOT NULL,
	"proposed_hourly_rate" real,
	"proposed_duration" integer,
	"proposed_workplace" "workPlaceEnum",
	"buyer_agreed" timestamp,
	"seller_agreed" timestamp,
	"buyer_declined" timestamp,
	"seller_declined" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "offers_job_id_seller_id_unique" UNIQUE("job_id","seller_id")
);
--> statement-breakpoint
ALTER TABLE "orders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "orders" CASCADE;--> statement-breakpoint
ALTER TABLE "offers" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "offers" ALTER COLUMN "status" SET DEFAULT 'pending'::text;--> statement-breakpoint
DROP TYPE "public"."offerStatusEnum";--> statement-breakpoint
CREATE TYPE "public"."offerStatusEnum" AS ENUM('pending', 'withdrawn', 'accepted', 'rejected');--> statement-breakpoint
ALTER TABLE "offers" ALTER COLUMN "status" SET DEFAULT 'pending'::"public"."offerStatusEnum";--> statement-breakpoint
ALTER TABLE "offers" ALTER COLUMN "status" SET DATA TYPE "public"."offerStatusEnum" USING "status"::"public"."offerStatusEnum";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'upcoming'::text;--> statement-breakpoint
DROP TYPE "public"."bookingStatusEnum";--> statement-breakpoint
CREATE TYPE "public"."bookingStatusEnum" AS ENUM('upcoming', 'ongoing', 'completed', 'cancelled', 'disputed');--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'upcoming'::"public"."bookingStatusEnum";--> statement-breakpoint
ALTER TABLE "bookings" ALTER COLUMN "status" SET DATA TYPE "public"."bookingStatusEnum" USING "status"::"public"."bookingStatusEnum";--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "status" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "status" SET DATA TYPE "public"."jobStatusEnum" USING "status"::text::"public"."jobStatusEnum";--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "status" SET DEFAULT 'active';--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;