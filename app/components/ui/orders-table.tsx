/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { TodoOrder } from "~/types";
import { formatDateTime, isOverdue, isDueToday } from "~/lib/utils";
import { Checkbox } from "./checkbox";
import { Button } from "./button";
import { Pencil, Trash2, ArrowUpDown, Filter, X, Search } from "lucide-react";
import EditTodoDialog from "./edit-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "~/hooks/use-mobile";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
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
import { updateOrder, deleteOrder } from "~/lib/orders";
import { useRevalidator } from "@remix-run/react";
import { Badge } from "./badge";

const OrdersTable = ({ data }: { data: TodoOrder[] }) => {
  const [editingTodo, setEditingTodo] = useState<TodoOrder | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);
  const revalidator = useRevalidator();
  // filter status
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<{
    status: string | null;
    priority: string | null;
    assignee: string | null;
  }>({
    status: null,
    priority: null,
    assignee: null,
  });

  const isMobile = useIsMobile();
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

  const confirmDelete = async () => {
    if (todoToDelete) {
      await deleteOrder(todoToDelete);
      setTimeout(() => {
        revalidator.revalidate();
      }, 100);
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
  // Handle status filter
  const handleStatusFilter = (value: string) => {
    if (value === "all") {
      table.getColumn("completed")?.setFilterValue(undefined);
      setAppliedFilters((prev) => ({ ...prev, status: null }));
    } else {
      const isCompleted = value === "completed";
      table.getColumn("completed")?.setFilterValue(isCompleted);
      setAppliedFilters((prev) => ({ ...prev, status: value }));
    }
  };

  // Handle priority filter
  const handlePriorityFilter = (value: string) => {
    if (value === "all") {
      table.getColumn("priority")?.setFilterValue(undefined);
      setAppliedFilters((prev) => ({ ...prev, priority: null }));
    } else {
      table.getColumn("priority")?.setFilterValue([value]);
      setAppliedFilters((prev) => ({ ...prev, priority: value }));
    }
  };

  // Handle assignee filter
  const handleAssigneeFilter = (value: string) => {
    if (value === "all") {
      table.getColumn("assignedTo")?.setFilterValue(undefined);
      setAppliedFilters((prev) => ({ ...prev, assignee: null }));
    } else {
      table.getColumn("assignedTo")?.setFilterValue([value]);
      setAppliedFilters((prev) => ({ ...prev, assignee: value }));
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    table.resetColumnFilters();
    setAppliedFilters({
      status: null,
      priority: null,
      assignee: null,
    });
  };

  // Clear individual filter
  const clearFilter = (filterType: "status" | "priority" | "assignee") => {
    if (filterType === "status") {
      table.getColumn("completed")?.setFilterValue(undefined);
    } else if (filterType === "priority") {
      table.getColumn("priority")?.setFilterValue(undefined);
    } else if (filterType === "assignee") {
      table.getColumn("assignedTo")?.setFilterValue(undefined);
    }

    setAppliedFilters((prev) => ({ ...prev, [filterType]: null }));
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
  const renderAppliedFilters = () => {
    if (
      !appliedFilters.status &&
      !appliedFilters.priority &&
      !appliedFilters.assignee
    ) {
      return null;
    }

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {appliedFilters.status && (
          <Badge variant="secondary" className="flex items-center gap-1 py-1">
            {appliedFilters.status === "completed"
              ? "Completed"
              : "In Progress"}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => clearFilter("status")}>
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {appliedFilters.priority && (
          <Badge variant="secondary" className="flex items-center gap-1 py-1">
            {appliedFilters.priority}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => clearFilter("priority")}>
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {appliedFilters.assignee && (
          <Badge variant="secondary" className="flex items-center gap-1 py-1">
            {appliedFilters.assignee}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => clearFilter("assignee")}>
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {(appliedFilters.status ||
          appliedFilters.priority ||
          appliedFilters.assignee) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={clearAllFilters}>
            Clear all
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {/* Filters */}
        {isMobile ? (
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="Search orders..."
                onChange={(e) =>
                  table.getColumn("orderNumber")?.setFilterValue(e.target.value)
                }
                className="w-full pl-10 dark:focus:bg-gray-300 dark:focus:text-black"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setFilterDialogOpen(true)}
              className="flex-shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full md:w-1/4">
              <Select
                onValueChange={handleStatusFilter}
                value={appliedFilters.status || "all"}>
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
                onValueChange={handlePriorityFilter}
                value={appliedFilters.priority || "all"}>
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
                onValueChange={handleAssigneeFilter}
                value={appliedFilters.assignee || "all"}>
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
        )}

        {/* Applied Filters */}
        {renderAppliedFilters()}
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
      {/* delete dialog */}
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
      {/* add filter dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Orders</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="status-filter" className="text-sm font-medium">
                Status
              </label>
              <Select
                onValueChange={handleStatusFilter}
                value={appliedFilters.status || "all"}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="inprogress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="priority-filter" className="text-sm font-medium">
                Priority
              </label>
              <Select
                onValueChange={handlePriorityFilter}
                value={appliedFilters.priority || "all"}>
                <SelectTrigger id="priority-filter">
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

            <div className="grid gap-2">
              <label htmlFor="assignee-filter" className="text-sm font-medium">
                Assigned To
              </label>
              <Select
                onValueChange={handleAssigneeFilter}
                value={appliedFilters.assignee || "all"}>
                <SelectTrigger id="assignee-filter">
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
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={clearAllFilters}>
              Clear All
            </Button>
            <Button type="button" onClick={() => setFilterDialogOpen(false)}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrdersTable;
