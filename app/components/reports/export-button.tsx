import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "../ui/button";
import { ChevronDown, DownloadIcon, FileSpreadsheet } from "lucide-react";
import { PopoverContent } from "../ui/popover";
import { toast } from "sonner";
import { TodoOrder } from "~/types";
import { useState } from "react";
import { format } from "date-fns";

interface ExportOptionsProps {
  data: TodoOrder[];
  selectedOrders: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
}
export default function ExportButton({
  data,
  selectedOrders,
  startDate,
  endDate,
}: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const handleExportToExcel = () => {
    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }

    if (selectedOrders.length === 0) {
      toast.error("Please select at least one order to export");
      return;
    }

    setIsExporting(true);

    try {
      // Filter todos based on selected orders
      const todosToExport = data.filter((todo) =>
        selectedOrders.includes(todo.id)
      );

      // Create a CSV string from todos
      const headers = [
        "#Order",
        "Pages",
        "Due Date",
        "Writer",
        "Status",
        "Notes",
      ];
      const rows = todosToExport.map((todo) => [
        todo.orderNumber,
        todo.pages.toString(),
        format(new Date(todo.dueDate), "yyyy-MM-dd"),
        todo.assignedTo || "Unassigned",
        todo.completed ? "Completed" : "In Progress",
        todo.note,
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");

      // Create a Blob from the CSV string
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Create a download link and trigger the download
      const link = document.createElement("a");

      // Generate filename from date range
      const fromDate = startDate ? format(startDate, "yyyy-MM-dd") : "unknown";
      const toDate = endDate ? format(endDate, "yyyy-MM-dd") : "unknown";
      const filename = `orders_report_${fromDate}_to_${toDate}.csv`;

      // Set download attributes and trigger download
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${todosToExport.length} orders successfully`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          title="Export to Excel"
          className="flex items-center bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900 p-0 group gap-0">
          <div className="flex items-center px-4 py-2 h-full group-hover:bg-gray-700 group-hover:text-white dark:group-hover:bg-gray-300 dark:group-hover:text-gray-900 rounded-l-md  ">
            <DownloadIcon className="h-4 w-4 mr-2" />
            <span>Export</span>
          </div>
          <div className="flex items-center h-full px-4 py-2 border-l border-gray-700 dark:border-gray-400 group-hover:bg-gray-800 dark:hover:bg-gray-300 rounded-r-md group-hover:text-white dark:group-hover:bg-gray-400 dark:group-hover:text-gray-900 ">
            <ChevronDown className="h-4 w-4 group-hover:animate-bounce duration-150 ease-in-out" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 space-y-2  bg-gray-900 text-white dark:bg-gray-200 dark:text-gray-900">
        <Button
          variant="ghost"
          type="button"
          title="Export to Excel"
          className="justify-start gap-1 w-full"
          disabled={
            isExporting || data.length === 0 || selectedOrders.length === 0
          }
          onClick={handleExportToExcel}>
          <FileSpreadsheet className="h-4 w-4" /> Export Excel
        </Button>
        <Button
          variant="ghost"
          type="button"
          title="Export to Excel"
          className="justify-start gap-1 w-full"
          disabled={
            isExporting || data.length === 0 || selectedOrders.length === 0
          }
          onClick={() => toast.info("Export to PDF is not supported")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            width="1em"
            height="1em"
            className="h-4 w-4 stroke-red-500">
            <path
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.8 14.34c1.81-1.25 3.02-3.16 3.91-5.5c.9-2.33 1.86-4.33 1.44-6.63c-.06-.36-.57-.73-.83-.7c-1.02.06-.95 1.21-.85 1.9c.24 1.71 1.56 3.7 2.84 5.56c1.27 1.87 2.32 2.16 3.78 2.26c.5.03 1.25-.14 1.37-.58c.77-2.8-9.02-.54-12.28 2.08c-.4.33-.86 1-.6 1.46c.2.36.87.4 1.23.15h0Z"></path>
          </svg>{" "}
          Export PDF
        </Button>
      </PopoverContent>
    </Popover>
  );
}
