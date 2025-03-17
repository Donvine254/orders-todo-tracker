import { useState, useEffect } from "react";

import { Clipboard, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { formatDate } from "../../lib/utils";

export default function Header() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glassmorphism rounded-lg p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 shadow mb-6 border dark:bg-todo-primary">
      <div className="flex items-center gap-4">
        <div className="text-todo-primary bg-todo-light p-3 rounded-full">
          <Clipboard className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-light text-todo-primary tracking-tight dark:text-todo-light ">
            Orders Todo list
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <p className="text-lg font-medium">{formatDate(currentDate)}</p>
        <Button
          variant="secondary"
          className=" "
          onClick={() => navigate("/setup")}>
          <Settings className="h-4 w-4 mr-2" />
          Setup
        </Button>
      </div>
    </motion.div>
  );
}
