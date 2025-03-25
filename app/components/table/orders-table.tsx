import { useState } from "react";
import { TodoOrder } from "~/types";
import { isOverdue, isDueToday } from "~/lib/utils";
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
import { createTodoTableColumns } from "./table-columns";
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
  const columns = createTodoTableColumns(
    handleToggleCompletion,
    handleEdit,
    openDeleteDialog
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
