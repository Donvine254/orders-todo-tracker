import { toast } from "sonner";
import { TodoOrder } from "~/types";

export async function markOrderAsCompleted(id: string) {
  try {
    console.log(id);
  } catch (error) {
    console.error("Error marking order as completed:", error);
    throw new Error("Failed to update order");
  }
}

export async function createTodoOrder(
  data: Omit<TodoOrder, "id" | "createdAt" | "updatedAt">
) {
  try {
    const response = await fetch("/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create order");
    }
    const result = await response.json();
    toast.success("New order added successfully");
    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    toast.error("Failed to create order");
    throw error;
  }
}
