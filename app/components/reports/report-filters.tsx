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

const assignees = ["Donvine", "Jecinta", "Mwambire"];

const ReportFilters = ({ query, setQuery }: ReportFiltersProps) => {
  // Handle status change
  const handleStatusChange = (completed: boolean) => {
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
        <h3 className="text-lg font-medium mb-2">Assigned To</h3>
        <div className="flex flex-col space-y-2">
          {assignees.map((assignee) => (
            <div key={assignee} className="flex items-center space-x-2">
              <Checkbox
                id={`assignee-${assignee}`}
                checked={query.assignee === assignee}
                onCheckedChange={() => handleAssigneeChange(assignee)}
              />
              <Label htmlFor={`assignee-${assignee}`}>{assignee}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
