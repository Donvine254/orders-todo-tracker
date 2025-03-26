/* eslint-disable  @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table";
import { TodoOrder } from "~/types";
import { Checkbox } from "~/components/ui/checkbox";
import { Button } from "~/components/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { formatDateTime, isOverdue } from "~/lib/utils";
import { useMemo } from "react";

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

export const useTodoTableColumns = (
  handleToggleCompletion: (id: string, status: boolean) => void,
  handleEdit: (todo: TodoOrder) => void,
  openDeleteDialog: (id: string) => void
) => {
  return useMemo<ColumnDef<TodoOrder>[]>(
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
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0">
            # Order
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "pages",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0">
            Pages
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
      },
      {
        accessorKey: "dueDate",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0">
            Due Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
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
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0">
            Priority
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: any }) => (
          <span
            className={`priority-tag ${getPriorityStyles(
              row.original.priority
            )}`}>
            {row.original.priority}
          </span>
        ),
        filterFn: (row: any, id: string, value: any) =>
          value.includes(row.getValue(id)),
      },
      {
        accessorKey: "assignedTo",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0">
            Assigned To
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        filterFn: (row: any, id: string, value: any) =>
          value.includes(row.getValue(id)),
      },
      {
        accessorKey: "note",
        header: "Note",
      },
      {
        id: "actions",
        cell: ({ row }: { row: any }) => (
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
        ),
      },
    ],
    [handleToggleCompletion, handleEdit, openDeleteDialog]
  );
};
