import { TodoOrder } from "~/types";
import { Checkbox } from "../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

interface ReportTableProps {
  data: TodoOrder[];
  selectedOrders: string[];
  onOrderSelectionChange: (orderIds: string[]) => void;
}

const ReportTable = ({
  data,
  selectedOrders,
  onOrderSelectionChange,
}: ReportTableProps) => {
  // Handle select all checkbox change
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onOrderSelectionChange(data.map((todo) => todo.id));
    } else {
      onOrderSelectionChange([]);
    }
  };

  // Handle individual checkbox change
  const handleOrderSelect = (id: string, checked: boolean) => {
    if (checked) {
      onOrderSelectionChange([...selectedOrders, id]);
    } else {
      onOrderSelectionChange(
        selectedOrders.filter((orderId) => orderId !== id)
      );
    }
  };

  const areAllSelected =
    data.length > 0 && selectedOrders.length === data.length;

  return (
    <div>
      <div className="rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeIn overflow-hidden">
        <Table className="orders-table md:text-base">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={areAllSelected}
                  onCheckedChange={handleSelectAll}
                  className="dark:bg-green-500 "
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="whitespace-nowrap"># Order</TableHead>
              <TableHead>Pages</TableHead>
              <TableHead className="whitespace-nowrap">Due Date</TableHead>
              <TableHead className="whitespace-nowrap">Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((todo: TodoOrder) => (
              <TableRow key={todo.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrders.includes(todo.id)}
                    onCheckedChange={(checked) =>
                      handleOrderSelect(todo.id, checked as boolean)
                    }
                    aria-label={`Select order ${todo.orderNumber}`}
                  />
                </TableCell>
                <TableCell>{todo.orderNumber}</TableCell>
                <TableCell>{todo.pages}</TableCell>
                <TableCell>
                  {format(new Date(todo.dueDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>{todo.assignedTo || "Unassigned"}</TableCell>
                <TableCell>
                  <Badge variant={todo.completed ? "default" : "secondary"}>
                    {todo.completed ? "Completed" : "In Progress"}
                  </Badge>
                </TableCell>
                <TableCell>{todo.note}</TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No orders found for the selected criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {data.length} orders
        </p>
        <p className="text-sm text-muted-foreground">
          {selectedOrders.length} orders selected
        </p>
      </div>
    </div>
  );
};

export default ReportTable;
