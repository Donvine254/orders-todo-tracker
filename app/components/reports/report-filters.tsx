import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

interface ReportFiltersProps {
  query: {
    assignee: string;
    completed: boolean | null;
  };
  setQuery: React.Dispatch<
    React.SetStateAction<{
      startDate: Date | null;
      endDate: Date | null;
      assignee: string;
      completed: boolean | null;
    }>
  >;
}

const assignees = ["", "Donvine", "Jecinta", "Mwambire"];

const ReportFilters = ({ query, setQuery }: ReportFiltersProps) => {
  // Handle status change
  const handleStatusChange = (completed: boolean | null) => {
    setQuery((prev) => ({ ...prev, completed }));
  };

  // Handle assignee selection (only one can be selected)
  const handleAssigneeChange = (assignee: string) => {
    setQuery((prev) => ({
      ...prev,
      assignee: prev.assignee === assignee ? "" : assignee, // Toggle selection
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Order Status</h3>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-completed"
              checked={query.completed === null}
              onCheckedChange={() => handleStatusChange(null)}
            />
            <Label htmlFor="status-completed">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-completed"
              checked={query.completed === true}
              onCheckedChange={() => handleStatusChange(true)}
            />
            <Label htmlFor="status-completed">Completed</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="status-inprogress"
              checked={query.completed === false}
              onCheckedChange={() => handleStatusChange(false)}
            />
            <Label htmlFor="status-inprogress">In Progress</Label>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Writer</h3>
        <div className="flex flex-col space-y-2">
          {assignees.map((assignee) => (
            <div
              key={assignee || "all"}
              className="flex items-center space-x-2">
              <Checkbox
                id={`assignee-${assignee || "all"}`}
                checked={query.assignee === assignee}
                onCheckedChange={() => handleAssigneeChange(assignee)}
              />
              <Label htmlFor={`assignee-${assignee || "all"}`}>
                {assignee ? assignee : "All"}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between">
        <p className="font-medium whitespace-nowrap">Results Per Page:</p>
        <select
          id="pages-filter"
          className="w-fit border-b-2 px-2 dark:border-gray-400 dark:bg-background  focus:outline-none"
          defaultValue={100}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
    </div>
  );
};

export default ReportFilters;
