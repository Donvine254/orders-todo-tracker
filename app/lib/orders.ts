import { toast } from "sonner";
import { TodoOrder } from "~/types";

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

export async function updateOrder(
  id: string,
  data: Partial<Omit<TodoOrder, "id" | "createdAt" | "updatedAt">>
) {
  console.log(data);
  try {
    if (!id || !data) {
      throw new Error("Missing order ID or data to update");
    }

    if (data.dueDate) {
      const parsedDate = new Date(data.dueDate);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid dueDate format");
      }
      data.dueDate = parsedDate.toISOString();
    }
    const response = await fetch("/orders", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, data }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order");
    }

    toast.success("Order updated successfully");
    return await response.json();
    // eslint-disable-next-line
  } catch (error: any) {
    console.error("Error updating order:", error);
    toast.error(error.message || "Failed to update order");
    throw error;
  }
}

export async function deleteOrder(id: string) {
  try {
    if (!id) {
      throw new Error("Order ID is required");
    }

    const response = await fetch(`/orders`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete order");
    }

    toast.success("Order deleted successfully");
    return await response.json();
    // eslint-disable-next-line
  } catch (error: any) {
    console.error("Error deleting order:", error);
    toast.error(error.message || "Failed to delete order");
    throw error;
  }
}
