import { useCallback, useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import { CircleHelp, Loader2 } from "lucide-react";
import { isAuth } from "~/lib/auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { DateRangePicker } from "~/components/reports/date-range-picker";
import ReportFilters from "~/components/reports/report-filters";
import { TodoOrder } from "~/types";
import { toast } from "sonner";
import ReportTable from "~/components/reports/report-table";
import Header from "~/components/ui/header";
import ExportButton from "~/components/reports/export-button";
import { OrderTable } from "~/db/schema";
import { db } from "~/db";
import { desc } from "drizzle-orm";

export const meta: MetaFunction = () => {
  return [
    { title: "Reports | Order Status Tracker" },
    {
      name: "description",
      content: "A simple website to track order progress!",
    },
  ];
};

export const loader = async ({ request }: { request: Request }) => {
  const isAuthenticated = await isAuth(request);
  if (!isAuthenticated) {
    return redirect("/auth/login");
  }

  const data = await db
    .select()
    .from(OrderTable)
    .orderBy(desc(OrderTable.createdAt))
    .limit(10);

  return Response.json(data);
};

export default function Index() {
  const [isMounted, setIsMounted] = useState(false);
  const loaderData = useLoaderData<typeof loader>();
  const [orders, setOrders] = useState<TodoOrder[]>(loaderData || []);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [query, setQuery] = useState<{
    startDate: Date | null;
    endDate: Date | null;
    assignee: string;
    completed: boolean | null;
  }>({
    startDate: null,
    endDate: null,
    assignee: "",
    completed: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      startDate: null,
      endDate: null,
      assignee: "",
      completed: null, // Reset status filter
    });
    setOrders(loaderData || []);
  }, [loaderData]);
  const handleOrderSelection = (orderIds: string[]) => {
    setSelectedOrders(orderIds);
  };
  async function handleGenerateReport() {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      });
      if (!response.ok) {
        toast.error("Failed to generate report");
        throw new Error("Failed to generate report");
      }
      const data = await response.json();
      if (!Array.isArray(data) || data.length < 0) {
        toast.info("No orders found for the selected criteria");
        throw new Error("Invalid response data");
      }
      setOrders(data);
      toast.success(`Found ${data.length} orders matching criteria`);
    } catch (error) {
      toast.error("No matching orders found");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isMounted) {
    return (
      <div className="h-screen bg-gradient-to-b from-todo-light to-white dark:from-gray-900 dark:to-gray-950 flex justify-center items-center">
        <Loader2 size={64} className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-todo-light to-white dark:from-gray-900 dark:to-gray-950 p-4 md:p-6 mx-auto py-6 space-y-6">
      <Header />
      <h1 className="text-xl md:text-2xl font-bold">Generate Reports</h1>
      <div className="md:grid md:grid-cols-3 md:gap-4 md:border md:p-1 md:rounded-md md:relative">
        {/* card for conditions */}
        <Card className="max-w-md md:col-span-1 max-h-fit md:sticky md:top-20">
          <CardHeader className="px-0 bg-muted mb-4 rounded-t-md py-2">
            <CardTitle className="font-bold md:text-xl px-3 flex items-center gap-2 ">
              Filters
              <span title="Filter report by date, writer and status">
                {" "}
                <CircleHelp className="h-4 w-4 cursor-pointer fill-blue-500 text-white" />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <DateRangePicker
              onChange={handleDateRangeChange}
              placeholder="Select date ranges"
              clearFilter={handleFilterReset}
            />
            <ReportFilters query={query} setQuery={setQuery} />
            <div className="flex items-center justify-between gap-4">
              <button
                className="w-full text-primary underline-offset-4 hover:underline text-start"
                title="reset filters"
                onClick={handleFilterReset}>
                Reset All
              </button>
              <Button
                className="w-full"
                title="select a date range first"
                disabled={isSubmitting || !query.startDate || !query.endDate}
                onClick={handleGenerateReport}>
                {isSubmitting ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  "Generate Report"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* card for table */}
        <Card className="md:col-span-2 !p-0 border-none bg-transparent">
          <CardHeader className="px-0 mb-4 py-2">
            {" "}
            <CardTitle className="flex items-center justify-between gap-4 px-3 ">
              <span className="font-bold md:text-xl flex items-center gap-2">
                Report Overview{" "}
                <span title="You must first select orders to export">
                  {" "}
                  <CircleHelp className="h-4 w-4 cursor-pointer fill-blue-500 text-white" />
                </span>
              </span>
              <ExportButton
                data={orders}
                selectedOrders={selectedOrders}
                startDate={query.startDate as Date}
                endDate={query.endDate as Date}
              />
            </CardTitle>
          </CardHeader>

          <CardContent className="px-0">
            <ReportTable
              data={orders}
              selectedOrders={selectedOrders}
              onOrderSelectionChange={handleOrderSelection}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
