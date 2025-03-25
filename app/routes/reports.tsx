import { useCallback, useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { isAuth } from "~/lib/auth";
// import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DateRangePicker } from "~/components/reports/date-range-picker";
import ReportFilters from "~/components/reports/report-filters";
export const meta: MetaFunction = () => {
  return [
    { title: "TODO Order Tracker" },
    {
      name: "description",
      content: "A simple website to track order progress!",
    },
  ];
};

export const loader = async ({ request }: { request: Request }) => {
  const isAuthenticated = await isAuth(request);
  if (!isAuthenticated) {
    return redirect("/login");
  }

  return Response.json({ message: "Logged in successfully" });
};
export default function Index() {
  const [isMounted, setIsMounted] = useState(false);
  const [query, setQuery] = useState<{
    startDate: Date;
    endDate: Date;
    assignee: string;
    completed: boolean | null;
  }>({
    startDate: new Date(),
    endDate: new Date(),
    assignee: "",
    completed: null,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const handleDateRangeChange = useCallback(
    (range: { from: Date; to: Date } | undefined) => {
      if (range) {
        setQuery((prev) => ({
          ...prev,
          startDate: range.from,
          endDate: range.to,
        }));
      }
    },
    []
  );
  const handleFilterReset = useCallback(() => {
    setQuery({
      startDate: new Date(),
      endDate: new Date(),
      assignee: "",
      completed: null, // Reset status filter
    });
  }, []);

  if (!isMounted) {
    return (
      <div className="h-screen bg-gradient-to-b from-todo-light to-white dark:from-gray-900 dark:to-gray-950 flex justify-center items-center">
        <Loader2 size={64} className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-todo-light to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6 mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold ">Generate Reports</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Report Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DateRangePicker
              onChange={handleDateRangeChange}
              placeholder="Select date ranges"
              clearFilter={handleFilterReset}
            />
            <ReportFilters query={query} setQuery={setQuery} />
            <Button
              className="w-full"
              onClick={() => {
                console.log(query);
              }}>
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            {/* <ExportOptions
              filteredTodos={filteredTodos}
              selectedOrders={selectedOrders}
              startDate={startDate}
              endDate={endDate}
            /> */}
          </CardContent>
        </Card>
      </div>

      {/* {filteredTodos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Report Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ReportTable
              todos={filteredTodos}
              selectedOrders={selectedOrders}
              onOrderSelectionChange={handleOrderSelection}
            />
          </CardContent>
        </Card>
      )} */}
    </div>
  );
}
