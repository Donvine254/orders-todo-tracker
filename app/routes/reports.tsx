import { useEffect, useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import { OrderTable } from "~/db/schema";
import { db } from "~/db";
import { redirect, useLoaderData } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { isAuth } from "~/lib/auth";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TodoOrder } from "~/types";
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
  const todos = await db.select().from(OrderTable);

  return Response.json(todos);
};
export default function Index() {
  const orders = useLoaderData<typeof loader>();
  const [isMounted, setIsMounted] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([
    "completed",
    "inprogress",
  ]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<TodoOrder[]>([]);
  console.log(orders);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const handleDateRangeChange = (
    start: Date | undefined,
    end: Date | undefined
  ) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleStatusChange = (status: string[]) => {
    setSelectedStatus(status);
  };

  const handleAssigneeChange = (assignees: string[]) => {
    setSelectedAssignees(assignees);
  };

  const handleOrderSelection = (orderIds: string[]) => {
    setSelectedOrders(orderIds);
  };
  const handleGenerateReport = () => {
    if (!startDate || !endDate) {
      toast.error("Please select a date range");
      return;
    }

    // Filter todos based on selected criteria
    const filtered = orders.filter((todo: TodoOrder) => {
      const todoDate = new Date(todo.dueDate);
      const isInDateRange = todoDate >= startDate && todoDate <= endDate;

      // Filter by completion status
      const isStatusMatch = selectedStatus.includes("completed")
        ? todo.completed
          ? true
          : false
        : selectedStatus.includes("inprogress")
        ? !todo.completed
          ? true
          : false
        : false;

      // Filter by assignee (if any selected)
      const isAssigneeMatch =
        selectedAssignees.length === 0 ||
        selectedAssignees.includes(todo.assignedTo);

      return isInDateRange && isStatusMatch && isAssigneeMatch;
    });

    setFilteredTodos(filtered);

    if (filtered.length === 0) {
      toast.info("No orders found for the selected criteria");
    } else {
      toast.success(`Found ${filtered.length} orders matching your criteria`);
    }
  };

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
            {/* <ReportDateRangePicker
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={handleDateRangeChange}
            />

            <ReportFilters
              onStatusChange={handleStatusChange}
              onAssigneeChange={handleAssigneeChange}
              selectedStatus={selectedStatus}
              selectedAssignees={selectedAssignees}
            /> */}

            <Button className="w-full" onClick={handleGenerateReport}>
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
