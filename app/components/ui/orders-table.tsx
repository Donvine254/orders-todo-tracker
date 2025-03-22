/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { deleteTodo } from "~/lib/todo";
import { TodoOrder } from "~/types";
import { formatDateTime, isOverdue, isDueToday } from "~/lib/utils";
import { Checkbox } from "./checkbox";
import { Button } from "./button";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
import EditTodoDialog from "./edit-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Input } from "./input";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
} from "./table";
import { updateOrder } from "~/lib/orders";
import { useRevalidator } from "@remix-run/react";

const OrdersTable = ({ data }: { data: TodoOrder[] }) => {
  const [editingTodo, setEditingTodo] = useState<TodoOrder | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const revalidator = useRevalidator();
  // Table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // add function to toggle order as completed
  const handleToggleCompletion = async (id: string, currentStatus: boolean) => {
    await updateOrder(id, { completed: !currentStatus });
    setTimeout(() => {
      revalidator.revalidate();
    }, 100);
  };

  const handleEdit = (todo: TodoOrder) => {
    setEditingTodo(todo);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setTodoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (todoToDelete) {
      const success = deleteTodo(todoToDelete);
      if (success) {
        toast.success("Order deleted successfully");
      } else {
        toast.error("Failed to delete order");
      }
      setTodoToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-todo-high";
      case "medium":
        return "bg-todo-medium";
      case "low":
        return "bg-todo-low";
      default:
        return "bg-gray-400";
    }
  };

  const getRowClassName = (todo: TodoOrder) => {
    let className = "";

    if (todo.completed) {
      className += "completed bg-gray-50 dark:bg-gray-800/30 ";
    } else if (isDueToday(new Date(todo.dueDate))) {
      className += "bg-red-50 dark:bg-red-900/20 ";
    } else if (isOverdue(new Date(todo.dueDate))) {
      className += "bg-orange-50 dark:bg-orange-900/20 ";
    } else {
      className +=
        todo.id.indexOf("5") !== -1 ? "bg-todo-light dark:bg-gray-800/20 " : "";
    }

    return className;
  };

  // Define table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "completed",
        header: "Status",
        cell: ({ row }: { row: any }) => (
          <div className="text-center">
            <Checkbox
              checked={row.original.completed}
              onCheckedChange={() =>
                handleToggleCompletion(row.original.id, row.original.completed)
              }
              className="data-[state=checked]:bg-todo-primary data-[state=checked]:border-todo-primary"
            />
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "orderNumber",
        header: ({ column }: { column: any }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0">
              # Order
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "pages",
        header: ({ column }: { column: any }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0">
              Pages
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
      {
        accessorKey: "dueDate",
        header: ({ column }: { column: any }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0">
              Due Date
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }: { row: any }) => {
          const dueDate = new Date(row.original.dueDate);
          const isLate = isOverdue(dueDate) && !row.original.completed;

          return (
            <div
              className={`whitespace-nowrap ${
                isLate ? "text-red-600 dark:text-red-400 font-medium" : ""
              }`}>
              {formatDateTime(dueDate)}
            </div>
          );
        },
      },
      {
        accessorKey: "priority",
        header: ({ column }: { column: any }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0">
              Priority
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }: { row: any }) => (
          <span
            className={`priority-tag ${getPriorityStyles(
              row.original.priority
            )}`}>
            {row.original.priority}
          </span>
        ),
        filterFn: (row: any, id: string, value: any) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "assignedTo",
        header: ({ column }: { column: any }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
              className="px-0">
              Assigned To
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        filterFn: (row: any, id: string, value: any) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: "note",
        header: "Note",
      },
      {
        id: "actions",
        cell: ({ row }: { row: any }) => {
          return (
            <div className="flex justify-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(row.original)}
                className="h-8 w-8 text-gray-500 hover:text-todo-primary dark:text-gray-400 dark:hover:text-todo-primary">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openDeleteDialog(row.original.id)}
                className="h-8 w-8 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    []
  );

  // Initialize table
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/4">
            <Select
              onValueChange={(value) => {
                if (value === "all") {
                  table.getColumn("completed")?.setFilterValue(undefined);
                } else {
                  table
                    .getColumn("completed")
                    ?.setFilterValue(value === "completed");
                }
              }}
              defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/4">
            <Select
              onValueChange={(value) => {
                if (value === "all") {
                  table.getColumn("priority")?.setFilterValue(undefined);
                } else {
                  table.getColumn("priority")?.setFilterValue([value]);
                }
              }}
              defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/4">
            <Select
              onValueChange={(value) => {
                if (value === "all") {
                  table.getColumn("assignedTo")?.setFilterValue(undefined);
                } else {
                  table.getColumn("assignedTo")?.setFilterValue([value]);
                }
              }}
              defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Filter by assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignees</SelectItem>
                <SelectItem value="Jecinta">Jecinta</SelectItem>
                <SelectItem value="Donvine">Donvine</SelectItem>
                <SelectItem value="Mwambire">Mwambire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/4">
            <Input
              placeholder="Search orders..."
              onChange={(e) =>
                table.getColumn("orderNumber")?.setFilterValue(e.target.value)
              }
              className="max-w-full"
            />
          </div>
        </div>

        <div className="rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeIn overflow-hidden">
          <Table className="orders-table">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                <AnimatePresence>
                  {table.getRowModel().rows.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={getRowClassName(row.original)}
                      data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            Showing {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()} page(s)
          </div>
        </div>
      </div>

      <EditTodoDialog
        todo={editingTodo}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this order?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              order and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrdersTable;
