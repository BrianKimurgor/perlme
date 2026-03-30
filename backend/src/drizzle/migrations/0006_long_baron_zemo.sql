CREATE TYPE "public"."vibe_type" AS ENUM('SOCIAL_BUTTERFLY', 'SOLO_ADVENTURER', 'DEEP_DIVER', 'INSTANT_MATCH', 'SLOW_BURNER', 'EVENING_STAR', 'CAFFEINE_CRITIC', 'NIGHT_OWL', 'ACTIVITY_JUNKIE', 'WITTY_ONE', 'WHOLESOME', 'MEME_DEALER');--> statement-breakpoint
CREATE TABLE "user_vibe_counts" (
	"target_user_id" uuid NOT NULL,
	"vibe_type" "vibe_type" NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_vibe_counts_target_user_id_vibe_type_pk" PRIMARY KEY("target_user_id","vibe_type")
);
--> statement-breakpoint
CREATE TABLE "vibe_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"voter_id" uuid NOT NULL,
	"target_user_id" uuid NOT NULL,
	"vibe_type" "vibe_type" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "vibe_votes_voter_id_target_user_id_unique" UNIQUE("voter_id","target_user_id")
);
--> statement-breakpoint
ALTER TABLE "user_vibe_counts" ADD CONSTRAINT "user_vibe_counts_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vibe_votes" ADD CONSTRAINT "vibe_votes_voter_id_users_id_fk" FOREIGN KEY ("voter_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vibe_votes" ADD CONSTRAINT "vibe_votes_target_user_id_users_id_fk" FOREIGN KEY ("target_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;