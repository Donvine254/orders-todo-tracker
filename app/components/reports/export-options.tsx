import { useState } from "react";
import { Button } from "~/components/ui/button";
import { TodoOrder } from "~/types";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface ExportOptionsProps {
  data: TodoOrder[];
  selectedOrders: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const ExportOptions = ({
  data,
  selectedOrders,
  startDate,
  endDate,
}: ExportOptionsProps) => {
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
    <div className="space-y-6 ">
      <div className="pb-4">
        <h4 className="text-sm font-medium mb-2">Report Summary</h4>
        <div className="text-sm space-y-1">
          <p className="text-muted-foreground">
            Date Range:{" "}
            {startDate
              ? format(startDate, "MMM dd, yyyy")
              : format(new Date(), "MMM dd, yyyy")}{" "}
            to{" "}
            {endDate
              ? format(endDate, "MMM dd, yyyy")
              : format(new Date(), "MMM dd, yyyy")}
          </p>
          <p className="text-muted-foreground">Orders Found: {data.length}</p>
          <p className="text-muted-foreground">
            Orders Selected: {selectedOrders.length}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Export Report</h3>
        <p className="text-sm text-muted-foreground">
          Export your report in the format of your choice.
        </p>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <Button
            onClick={handleExportToExcel}
            className="w-full dark:bg-green-500 dark:text-white"
            variant="outline"
            disabled={
              isExporting || data.length === 0 || selectedOrders.length === 0
            }>
            {isExporting ? (
              <>
                <Loader2 size={16} className="mr-2 -ml-1" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                {" "}
                <FileSpreadsheet size={16} className="mr-2 -ml-1" />
                <span>Excel</span>
              </>
            )}
          </Button>
          <Button
            className="w-full dark:bg-gray-200 dark:text-black"
            variant="outline"
            disabled={
              isExporting || data.length === 0 || selectedOrders.length === 0
            }
            onClick={() => {
              toast.info("PDF export is not yet supported");
            }}>
            {isExporting ? (
              <>
                <Loader2 size={16} className="mr-2 -ml-1" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  width="1em"
                  height="1em"
                  className="mr-2 -ml-1 stroke-red-500">
                  <path
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.8 14.34c1.81-1.25 3.02-3.16 3.91-5.5c.9-2.33 1.86-4.33 1.44-6.63c-.06-.36-.57-.73-.83-.7c-1.02.06-.95 1.21-.85 1.9c.24 1.71 1.56 3.7 2.84 5.56c1.27 1.87 2.32 2.16 3.78 2.26c.5.03 1.25-.14 1.37-.58c.77-2.8-9.02-.54-12.28 2.08c-.4.33-.86 1-.6 1.46c.2.36.87.4 1.23.15h0Z"></path>
                </svg>
                <span>PDF</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportOptions;
