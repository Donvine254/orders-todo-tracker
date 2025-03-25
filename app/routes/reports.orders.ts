import { eq, gte, ilike, lte, and } from "drizzle-orm";
import { db } from "~/db";
import { OrderTable } from "~/db/schema";
export async function action({ request }: { request: Request }) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }
  try {
    const body = await request.json();
    const { startDate, endDate, assignee, completed } = body;

    if (!startDate || !endDate) {
      return Response.json({ error: "Invalid date range" }, { status: 400 });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return Response.json({ error: "Invalid date format" }, { status: 400 });
    }
    const conditions = [
      gte(OrderTable.createdAt, start),
      lte(OrderTable.createdAt, end),
    ];
    if (assignee) {
      conditions.push(
        ilike(OrderTable.assignedTo, `%${assignee.toLowerCase()}%`)
      );
    }

    if (typeof completed === "boolean") {
      conditions.push(eq(OrderTable.completed, completed));
    }
    const filteredOrders = await db
      .select()
      .from(OrderTable)
      .where(and(...conditions));

    return Response.json(filteredOrders);
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
