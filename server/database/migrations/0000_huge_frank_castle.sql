CREATE TYPE "public"."categoryEnum" AS ENUM('Web Development', 'Software Development', 'Network Engineering', 'Cybersecurity', 'DevOps');--> statement-breakpoint
CREATE TYPE "public"."countryEnum" AS ENUM('Luxembourg', 'France', 'Belgium', 'Germany');--> statement-breakpoint
CREATE TYPE "public"."languageEnum" AS ENUM('English', 'German', 'French');--> statement-breakpoint
CREATE TYPE "public"."offerStatusEnum" AS ENUM('Active', 'Paused', 'Deleted');--> statement-breakpoint
CREATE TYPE "public"."orderStatusEnum" AS ENUM('Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled');--> statement-breakpoint
CREATE TYPE "public"."roleEnum" AS ENUM('Freelancer', 'Company', 'Admin');--> statement-breakpoint
CREATE TYPE "public"."skillsEnum" AS ENUM('C', 'C#', 'C++', 'Go', 'Java', 'JavaScript', 'PHP', 'Python', 'Rust', 'TypeScript');--> statement-breakpoint
CREATE TYPE "public"."workPlaceEnum" AS ENUM('On site', 'Remote', 'Hybrid');--> statement-breakpoint
CREATE TABLE "offers" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "categoryEnum" NOT NULL,
	"skills" "skillsEnum" NOT NULL,
	"hourly_rate" real NOT NULL,
	"duration" integer DEFAULT 1 NOT NULL,
	"work_place" "workPlaceEnum" NOT NULL,
	"location" "countryEnum" NOT NULL,
	"status" "offerStatusEnum" DEFAULT 'Active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"offer_id" integer NOT NULL,
	"buyer_id" integer NOT NULL,
	"seller_id" integer NOT NULL,
	"price" real NOT NULL,
	"status" "orderStatusEnum" DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"house_number" integer,
	"street" text,
	"zip" text,
	"country" "countryEnum" NOT NULL,
	"language" "languageEnum",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "roleEnum" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "offers" ADD CONSTRAINT "offers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_offer_id_offers_id_fk" FOREIGN KEY ("offer_id") REFERENCES "public"."offers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;