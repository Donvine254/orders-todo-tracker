export async function markOrderAsCompleted(id: string) {
  try {
    console.log(id);
  } catch (error) {
    console.error("Error marking order as completed:", error);
    throw new Error("Failed to update order");
  }
}
