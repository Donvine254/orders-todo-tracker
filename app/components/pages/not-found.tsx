import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Home, MoveLeft, SearchX } from "lucide-react";
import LostAstronaut from "./lost-astronaut";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-indigo-900 p-4">
      <div className="max-w-md w-full bg-black/20 backdrop-blur-sm rounded-xl p-8 shadow-xl">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-full flex justify-center">
            <LostAstronaut />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <SearchX className="h-6 w-6 text-blue-400" />
              <h1 className="text-3xl font-bold text-white">
                404 Page Not Found
              </h1>
            </div>
            <p className="text-muted-foreground">
              Houston, we have a problem! This page seems to have drifted into
              deep space.
            </p>
          </div>

          <div className="w-full max-w-xs pt-4">
            <div className="flex flex-col space-y-3">
              <Button
                asChild
                className="bg-todo-primary hover:bg-todo-primary/90 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-800">
                <a href="/" className="inline-flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Return to Home
                </a>
              </Button>
              <Button onClick={() => window.history.back()} variant="outline">
                <MoveLeft className="h-4 w-4 mr-2" /> Go Back
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground pt-4">
            Error Code: 404 - Page Not Found
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
