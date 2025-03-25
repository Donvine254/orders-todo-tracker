import { TodoOrder, TodoStats } from "~/types";
import { Clock, AlertTriangle, RotateCcw, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getStats } from "~/lib/stats";

const StatusCards = ({ data }: { data: TodoOrder[] }) => {
  const stats: TodoStats = getStats(data);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <motion.div variants={item} className="status-card bg-red-100">
        <div className="flex flex-col items-center">
          <div className="bg-red-500 text-white p-2 rounded-full mb-2">
            <Clock className="h-5 w-5" />
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">Due today</p>
          <p className="text-2xl font-bold text-red-500">{stats.dueToday}</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="status-card bg-amber-50">
        <div className="flex flex-col items-center">
          <div className="bg-amber-500 text-white p-2 rounded-full mb-2">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">Overdue</p>
          <p className="text-2xl font-bold text-amber-500">{stats.overdue}</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="status-card bg-blue-100">
        <div className="flex flex-col items-center">
          <div className="bg-blue-500 text-white p-2 rounded-full mb-2">
            <RotateCcw className="h-5 w-5" />
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">In Progress</p>
          <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="status-card bg-green-50">
        <div className="flex flex-col items-center">
          <div className="bg-green-500 text-white p-2 rounded-full mb-2">
            <CheckCircle className="h-5 w-5" />
          </div>
          <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatusCards;
