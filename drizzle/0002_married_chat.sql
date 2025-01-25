CREATE TYPE "public"."transaction_type" AS ENUM('credit', 'debit', 'refund');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "wallet" real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "type" "transaction_type" DEFAULT 'credit' NOT NULL;