CREATE TYPE "public"."transfer_key_type" AS ENUM('pix', 'bank_account');--> statement-breakpoint
CREATE TABLE "transfer_keys" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text,
	"user_id" text,
	"type" "transfer_key_type" DEFAULT 'pix' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "transfer_keys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "transfer_keys" ADD CONSTRAINT "transfer_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;