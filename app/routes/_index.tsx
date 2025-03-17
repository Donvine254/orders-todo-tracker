import Header from "~/components/ui/header";
import type { MetaFunction } from "@remix-run/node";
import { motion } from "framer-motion";
export const meta: MetaFunction = () => {
  return [
    { title: "TODO Order Tracker" },
    {
      name: "description",
      content: "A simple website to track order progress!",
    },
  ];
};

export default function Index() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-todo-light to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <Header />
      </div>
    </motion.div>
  );
}
