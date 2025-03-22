import { useEffect, useState } from "react";
import Header from "~/components/ui/header";
import type { MetaFunction } from "@remix-run/node";
import { motion } from "framer-motion";
import StatusCards from "~/components/ui/status-cards";
import AddTodoButton from "~/components/ui/add-todo";
import { OrderTable } from "~/db/schema";
import { db } from "~/db";
import { useLoaderData } from "@remix-run/react";
import OrdersTable from "~/components/ui/orders-table";
import { Loader2 } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "TODO Order Tracker" },
    {
      name: "description",
      content: "A simple website to track order progress!",
    },
  ];
};

export const loader = async () => {
  const todos = await db.select().from(OrderTable);
  return Response.json(todos);
};

export default function Index() {
  const orders = useLoaderData<typeof loader>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="h-screen bg-gradient-to-b from-todo-light to-white dark:from-gray-900 dark:to-gray-950 flex justify-center items-center">
        <Loader2 size={64} className="animate-spin" />
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-todo-light to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
        <StatusCards data={orders} />
        <div className="flex justify-between items-center my-6">
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-200">
            Orders
          </h2>
          <AddTodoButton />
        </div>
      </div>
      <hr className="mb-4" />
      <OrdersTable data={orders} />
    </motion.div>
  );
}
