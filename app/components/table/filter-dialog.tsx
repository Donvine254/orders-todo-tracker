import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appliedFilters: {
    status: string | null;
    priority: string | null;
    assignee: string | null;
  };
  handleStatusFilter: (value: string) => void;
  handlePriorityFilter: (value: string) => void;
  handleAssigneeFilter: (value: string) => void;
  clearAllFilters: () => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onOpenChange,
  appliedFilters,
  handleStatusFilter,
  handlePriorityFilter,
  handleAssigneeFilter,
  clearAllFilters,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
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
        <DialogFooter className="flex flex-row gap-6">
          <Button type="button" onClick={() => onOpenChange(false)}>
            Apply
          </Button>
          <Button variant="link" onClick={clearAllFilters}>
            Clear All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FilterDialog;
