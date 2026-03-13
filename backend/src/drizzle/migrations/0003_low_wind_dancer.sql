CREATE TYPE "public"."distance_preference" AS ENUM('KM_10', 'KM_50', 'KM_100', 'GLOBAL');--> statement-breakpoint
CREATE TYPE "public"."drinking_habit" AS ENUM('NEVER', 'SOCIALLY', 'REGULARLY');--> statement-breakpoint
CREATE TYPE "public"."education_level" AS ENUM('HIGH_SCHOOL', 'COLLEGE', 'BACHELORS', 'MASTERS', 'PHD');--> statement-breakpoint
CREATE TYPE "public"."fitness_level" AS ENUM('VERY_ACTIVE', 'MODERATELY_ACTIVE', 'NOT_ACTIVE');--> statement-breakpoint
CREATE TYPE "public"."has_children" AS ENUM('YES', 'NO');--> statement-breakpoint
CREATE TYPE "public"."pronouns" AS ENUM('HE_HIM', 'SHE_HER', 'THEY_THEM', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."relationship_intention" AS ENUM('MARRIAGE', 'LONG_TERM', 'LONG_TERM_OPEN_SHORT', 'SHORT_TERM_OPEN_LONG', 'CASUAL', 'FRIENDSHIP', 'FIGURING_OUT');--> statement-breakpoint
CREATE TYPE "public"."smoking_habit" AS ENUM('NON_SMOKER', 'OCCASIONALLY', 'SMOKER');--> statement-breakpoint
CREATE TYPE "public"."wants_children" AS ENUM('WANT', 'DONT_WANT', 'NOT_SURE');--> statement-breakpoint
CREATE TABLE "languages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "languages_name_unique" UNIQUE("name"),
	CONSTRAINT "languages_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "personality_traits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "personality_traits_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_discovery_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"min_age" integer DEFAULT 18,
	"max_age" integer DEFAULT 99,
	"distance_km" integer,
	"distance_preference" "distance_preference" DEFAULT 'KM_50',
	"show_location" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_discovery_preferences_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_interested_in" (
	"user_id" uuid NOT NULL,
	"gender" "gender" NOT NULL,
	"assigned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_languages" (
	"user_id" uuid NOT NULL,
	"language_id" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_personality_traits" (
	"user_id" uuid NOT NULL,
	"trait_id" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "pronouns" "pronouns";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "relationship_intention" "relationship_intention";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "has_children" "has_children";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "wants_children" "wants_children";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "smoking_habit" "smoking_habit";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "drinking_habit" "drinking_habit";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "fitness_level" "fitness_level";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "education_level" "education_level";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "occupation" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "industry" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ethnicity" varchar(255);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_phone_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_photo_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profile_completed_at" timestamp;--> statement-breakpoint
ALTER TABLE "user_discovery_preferences" ADD CONSTRAINT "user_discovery_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interested_in" ADD CONSTRAINT "user_interested_in_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_languages" ADD CONSTRAINT "user_languages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_languages" ADD CONSTRAINT "user_languages_language_id_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_personality_traits" ADD CONSTRAINT "user_personality_traits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_personality_traits" ADD CONSTRAINT "user_personality_traits_trait_id_personality_traits_id_fk" FOREIGN KEY ("trait_id") REFERENCES "public"."personality_traits"("id") ON DELETE cascade ON UPDATE no action;