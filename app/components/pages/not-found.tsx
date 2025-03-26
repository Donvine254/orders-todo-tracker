import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Home } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-todo-light to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="text-center glassmorphism dark:shadow-lg border p-8 rounded-lg shadow-md">
        <h1 className="text-6xl font-light text-todo-primary dark:text-white mb-4">
          404
        </h1>
        <p className="text-xl text-gray-600 dark:text-white mb-6">
          Oops! Page not found
        </p>
        <Button
          asChild
          className="bg-todo-primary hover:bg-todo-primary/90 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-800">
          <a href="/" className="inline-flex items-center">
            <Home className="h-4 w-4 mr-2" />
            Return to Home
          </a>
        </Button>
      </div>
    </motion.div>
  );
};

export default NotFound;
