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

export const roleEnum = pgEnum("role", ["admin", "user"]);
export const OrderTable = pgTable(
  "Order",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: varchar("order_number", { length: 255 }).notNull().unique(),
    pages: integer("pages").notNull(),
    dueDate: timestamp("due_date").notNull(),
    priority: priorityEnum("priority").default("low").notNull(),
    assignedTo: varchar("assigned_to", { length: 255 }).notNull(),
    note: varchar("note", { length: 2048 }),
    completed: boolean("completed").default(false),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    orderNumberIdx: index("order_number_idx").on(table.orderNumber),
    dueDateIdx: index("due_date_idx").on(table.dueDate),
    assignedToIdx: index("assigned_to_idx").on(table.assignedTo),
    dueDateCompletedIdx: index("due_date_completed_idx").on(
      table.dueDate,
      table.completed
    ),
  })
);

export const UserTable = pgTable(
  "User",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    username: varchar("username", { length: 255 }).notNull().unique(),
    role: roleEnum("role").default("user").notNull(),
    passwordDigest: varchar("password_digest", { length: 255 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    emailIndx: index("email").on(table.email),
    usernameIndx: index("username").on(table.username),
  })
);
