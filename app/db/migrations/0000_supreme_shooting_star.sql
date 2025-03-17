CREATE TYPE "public"."priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TABLE "Order" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" varchar(255) NOT NULL,
	"pages" integer NOT NULL,
	"due_date" timestamp NOT NULL,
	"priority" "priority" DEFAULT 'low',
	"assigned_to" varchar(255) NOT NULL,
	"note" varchar(2048),
	"completed" boolean DEFAULT false,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX "order_number_idx" ON "Order" USING btree ("order_number");--> statement-breakpoint
CREATE INDEX "due_date_idx" ON "Order" USING btree ("due_date");--> statement-breakpoint
CREATE INDEX "assigned_to_idx" ON "Order" USING btree ("assigned_to");