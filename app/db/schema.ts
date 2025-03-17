import {
  pgTable,
  varchar,
  integer,
  timestamp,
  boolean,
  pgEnum,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);
export const OrderTable = pgTable(
  "Order",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: varchar("order_number", { length: 255 }).notNull(),
    pages: integer("pages").notNull(),
    dueDate: timestamp("due_date").notNull(),
    priority: priorityEnum("priority").default("low"),
    assignedTo: varchar("assigned_to", { length: 255 }).notNull(),
    note: varchar("note", { length: 2048 }),
    completed: boolean("completed").default(false),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    orderNumberIdx: index("order_number_idx").on(table.orderNumber),
    dueDateIdx: index("due_date_idx").on(table.dueDate),
    assignedToIdx: index("assigned_to_idx").on(table.assignedTo),
  })
);


