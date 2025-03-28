import { Button } from "~/components/ui/button";
import { AlertTriangle, MoveLeft, RefreshCcw } from "lucide-react";
import ErrorRobot from "./error-robot";

const ServerError = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-todo-light to-white dark:from-gray-900 dark:to-gray-950  p-4">
      <div className="max-w-md w-full bg-amber-50/50 dark:bg-black/50 backdrop-blur-sm rounded-xl p-8 shadow-xl">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-full flex justify-center">
            <ErrorRobot />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              <h1 className="text-3xl font-bold">500 Server Error</h1>
            </div>
            <p className="text-muted-foreground">
              Oops! Our server is taking a coffee break. We&apos;re working to
              fix the issue.
            </p>
          </div>

          <div className="w-full max-w-xs pt-4">
            <div className="flex flex-col space-y-3">
              <Button
                asChild
                className="bg-todo-primary hover:bg-todo-primary/90 dark:bg-gray-200 dark:hover:bg-gray-300 text-white dark:text-gray-800">
                <a href="/" className="inline-flex items-center">
                  <MoveLeft className="h-4 w-4 mr-2" />
                  Return to Home
                </a>
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="secondary"
                className="">
                <RefreshCcw className="h-4 w-4 mr-2" /> Try Again
              </Button>
            </div>
          </div>

          <div className="text-xs text-slate-400 pt-4">
            Error Code: 500 - Internal Server Error
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
