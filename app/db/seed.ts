import { db } from ".";
import { OrderTable } from "./schema";
import "dotenv/config";
export async function main() {
  const now = new Date();
  await db.insert(OrderTable).values({
    orderNumber: "7227442",
    pages: 3,
    dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
    priority: "low",
    assignedTo: "Jecinta",
    note: "Submitted",
    completed: true,
  });
}

main();
