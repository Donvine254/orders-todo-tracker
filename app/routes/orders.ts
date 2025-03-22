/* eslint-disable  @typescript-eslint/no-explicit-any */
import { OrderTable } from "~/db/schema";
import { eq } from "drizzle-orm";
import { db } from "~/db";
// import { OrderData } from "~/types";

// ✅ Handle API requests
export async function loader() {
  try {
    const orders = await db
      .select()
      .from(OrderTable)
      .where(eq(OrderTable.completed, false));

    return Response.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
// ✅ Handle POST, PUT, and DELETE requests
export async function action({ request }: { request: Request }) {
  try {
    const method = request.method;

    if (method === "POST") {
      // Parse request data
      const data: any = await request.json();
      if (!data.orderNumber)
        return Response.json(
          { error: "Order Number is required" },
          { status: 400 }
        );

      // Insert new order into database
      await db.insert(OrderTable).values({ ...data });

      return Response.json({ success: true });
    }

    if (method === "PUT") {
      // Update an order
      const { id, data } = await request.json();
      if (!id || !data)
        return Response.json({ error: "Missing data" }, { status: 400 });

      await db.update(OrderTable).set(data).where(eq(OrderTable.id, id));

      return Response.json({ success: true });
    }

    if (method === "DELETE") {
      // Delete an order
      const { id } = await request.json();
      if (!id)
        return Response.json({ error: "Missing order ID" }, { status: 400 });

      await db.delete(OrderTable).where(eq(OrderTable.id, id));

      return Response.json({ success: true });
    }

    return Response.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    console.error("Error handling orders request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
