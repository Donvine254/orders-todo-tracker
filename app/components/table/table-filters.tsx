import React from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Filter, Search, X } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useIsMobile } from "~/hooks/use-mobile";
import { Table } from "@tanstack/react-table";
import { TodoOrder } from "~/types";

interface TableFiltersProps {
  table: Table<TodoOrder>;
  appliedFilters: {
    status: string | null;
    priority: string | null;
    assignee: string | null;
  };
  handleStatusFilter: (value: string) => void;
  handlePriorityFilter: (value: string) => void;
  handleAssigneeFilter: (value: string) => void;
  clearFilter: (filterType: "status" | "priority" | "assignee") => void;
  clearAllFilters: () => void;
  openFilterDialog: () => void;
}

const TableFilters: React.FC<TableFiltersProps> = ({
  table,
  appliedFilters,
  handleStatusFilter,
  handlePriorityFilter,
  handleAssigneeFilter,
  clearFilter,
  clearAllFilters,
  openFilterDialog,
}) => {
  const isMobile = useIsMobile();

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
          <Badge
            variant="secondary"
            className={`flex items-center gap-1 py-1 font-bold  ${
              appliedFilters.status === "completed"
                ? "bg-green-100 text-green-600 "
                : "bg-blue-100 text-blue-600"
            }`}>
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
          <Badge
            variant="secondary"
            className={`flex items-center gap-1 py-1  ${
              appliedFilters.priority === "High"
                ? "bg-red-100 text-red-500"
                : appliedFilters.priority === "Medium"
                ? "bg-amber-100 text-amber-600"
                : "bg-green-100 text-green-600"
            }`}>
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
          <Badge
            variant="secondary"
            className="flex items-center gap-1 py-1 dark:bg-gray-300 text-gray-800">
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
      {isMobile ? (
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-600"
            />
            <Input
              placeholder="Search orders..."
              type="search"
              onChange={(e) =>
                table.getColumn("orderNumber")?.setFilterValue(e.target.value)
              }
              className="w-full pl-10 dark:bg-gray-300 dark:text-black dark:placeholder:text-gray-600 dark:focus:bg-gray-100"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={openFilterDialog}
            className="flex-shrink-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:flex-1 max-w-1/2 relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600"
            />
            <Input
              placeholder="Search orders..."
              type="search"
              onChange={(e) =>
                table.getColumn("orderNumber")?.setFilterValue(e.target.value)
              }
              className="max-w-full pl-10 dark:bg-gray-300 dark:text-black dark:placeholder:text-gray-600 dark:focus:bg-gray-100"
            />
          </div>
          <div className="w-1/5 max-w-md">
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
          <div className="w-1/5 max-w-md">
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

          <div className="w-1/5 max-w-md">
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
        </div>
      )}
      {renderAppliedFilters()}
    </>
  );
};

export default TableFilters;
