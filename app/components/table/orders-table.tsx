/* eslint-disable  @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { TodoOrder } from "~/types";
import { formatDateTime, isOverdue, isDueToday } from "~/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import EditTodoDialog from "../ui/edit-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "~/hooks/use-mobile";
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
} from "../ui/table";
import { updateOrder, deleteOrder } from "~/lib/orders";
import { useRevalidator } from "@remix-run/react";
import DeleteDialog from "./delete-dialog";
import FilterDialog from "./filter-dialog";
import TableFilters from "./table-filters";
import TablePagination from "./pagination";
// TODO: Refactor this component
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
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-amber-100 text-amber-600";
      case "low":
        return "bg-green-100 text-green-600";
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

  return (
    <>
      <div className="space-y-4">
        {/* Table filters */}
        <TableFilters
          table={table}
          appliedFilters={appliedFilters}
          handleStatusFilter={handleStatusFilter}
          handlePriorityFilter={handlePriorityFilter}
          handleAssigneeFilter={handleAssigneeFilter}
          clearFilter={clearFilter}
          clearAllFilters={clearAllFilters}
          openFilterDialog={() => setFilterDialogOpen(true)}
        />
        {/* Beginning of table */}
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
                    😔 No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <TablePagination table={table} />
      </div>
      <EditTodoDialog
        todo={editingTodo}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
      {isMobile && (
        <FilterDialog
          open={filterDialogOpen}
          onOpenChange={setFilterDialogOpen}
          appliedFilters={appliedFilters}
          handleStatusFilter={handleStatusFilter}
          handlePriorityFilter={handlePriorityFilter}
          handleAssigneeFilter={handleAssigneeFilter}
          clearAllFilters={clearAllFilters}
        />
      )}
    </>
  );
};

export default OrdersTable;
