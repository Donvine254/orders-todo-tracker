import { useEffect, useState } from "react";
import { TodoOrder, Priority } from "~/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";
import { Textarea } from "./textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Checkbox } from "./checkbox";
import { addTodo, updateTodo } from "~/lib/todo";
import { formatDateForInput } from "~/lib/utils";
import { toast } from "sonner";

interface EditTodoDialogProps {
  todo: TodoOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

// const ASSIGNEES: Assignee[] = ['Jecinta', 'Donvine', 'Mwambire', ''];

const EditTodoDialog = ({
  todo,
  open,
  onOpenChange,
  onSave,
}: EditTodoDialogProps) => {
  const [formData, setFormData] = useState<Partial<TodoOrder>>({
    pages: 1,
    dueDate: new Date(),
    priority: "Low",
    assignedTo: "",
    note: "",
    completed: false,
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        ...todo,
        dueDate: new Date(todo.dueDate),
      });
    } else {
      // Set default values for new todo
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 1);
      dueDate.setHours(dueDate.getHours() + 2);

      setFormData({
        pages: 1,
        dueDate,
        priority: "Low",
        assignedTo: "",
        note: "",
        completed: false,
      });
    }
  }, [todo, open]);

  const handleChange = (field: keyof TodoOrder, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    toast.success("Processing...");
    try {
      if (!formData.pages || formData.pages < 1) {
        toast.error("Please enter a valid number of pages");
        return;
      }

      if (!formData.dueDate) {
        toast.error("Please select a due date");
        return;
      }

      if (todo) {
        // Update existing todo
        updateTodo(todo.id, formData);
        toast.success("Order updated successfully");
      } else {
        // Create new todo
        addTodo(
          formData as Omit<
            TodoOrder,
            "id" | "orderNumber" | "createdAt" | "updatedAt"
          >
        );
        toast.success("New order added successfully");
      }

      onSave();
      onOpenChange(false);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error saving todo:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            {todo ? "Edit Order" : "Add New Order"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pages" className="text-right">
              Pages
            </Label>
            <Input
              id="pages"
              type="number"
              min="1"
              value={formData.pages}
              onChange={(e) =>
                handleChange("pages", parseInt(e.target.value) || 1)
              }
              required
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dueDate" className="text-right">
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={
                formData.dueDate
                  ? formatDateForInput(new Date(formData.dueDate))
                  : ""
              }
              onChange={(e) =>
                handleChange("dueDate", new Date(e.target.value))
              }
              className="col-span-3 dark:bg-gray-100 dark:text-gray-900"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select
              value={formData.priority as string}
              onValueChange={(value) =>
                handleChange("priority", value as Priority)
              }>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedTo" className="text-right">
              Assigned To
            </Label>
            <Select
              value={formData.assignedTo || "Donvine"}
              onValueChange={(value) => handleChange("assignedTo", value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="N/A">Not assigned</SelectItem>
                <SelectItem value="Jecinta">Jecinta</SelectItem>
                <SelectItem value="Donvine">Donvine</SelectItem>
                <SelectItem value="Mwambire">Mwambire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note" className="text-right">
              Note
            </Label>
            <Textarea
              id="note"
              value={formData.note || ""}
              onChange={(e) => handleChange("note", e.target.value)}
              className="col-span-3 "
              rows={3}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="completed" className="text-right">
              Completed
            </Label>
            <div className="col-span-3 flex items-center">
              <Checkbox
                id="completed"
                checked={formData.completed}
                onCheckedChange={(checked) =>
                  handleChange("completed", !!checked)
                }
                className="data-[state=checked]:bg-todo-primary data-[state=checked]:border-todo-primary mr-2"
              />
              <Label htmlFor="completed" className="font-normal cursor-pointer">
                Mark as completed
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mr-2">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-todo-primary hover:bg-todo-primary/90">
            {todo ? "Update Order" : "Add Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTodoDialog;
