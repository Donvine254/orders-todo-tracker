ALTER TABLE "Order" ALTER COLUMN "priority" SET NOT NULL;--> statement-breakpoint
CREATE INDEX "due_date_completed_idx" ON "Order" USING btree ("due_date","completed");--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_order_number_unique" UNIQUE("order_number");