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
import { formatDateForInput } from "~/lib/utils";
import { toast } from "sonner";
import { createTodoOrder, updateOrder } from "~/lib/orders";
import { useRevalidator } from "@remix-run/react";
import { DialogDescription } from "@radix-ui/react-dialog";

interface EditTodoDialogProps {
  todo: TodoOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditTodoDialog = ({ todo, open, onOpenChange }: EditTodoDialogProps) => {
  const revalidator = useRevalidator();
  const [formData, setFormData] = useState<Partial<TodoOrder>>({
    orderNumber: undefined,
    pages: 1,
    dueDate: new Date(),
    priority: "low",
    assignedTo: "Donvine",
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
        orderNumber: undefined,
        pages: 1,
        dueDate,
        priority: "low",
        assignedTo: "N/A",
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
      if (!formData.orderNumber) {
        toast.error("Please provide a valid order number");
        return;
      }

      if (todo) {
        // Update existing todo
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, createdAt, updatedAt, ...updateData } = formData;
        updateOrder(todo.id, {
          ...updateData,
          dueDate: new Date(formData.dueDate),
        });
        revalidator.revalidate();
        setTimeout(() => {
          onOpenChange(false);
        }, 500);
      } else {
        // Create new todo
        createTodoOrder(
          formData as Omit<TodoOrder, "id" | "createdAt" | "updatedAt">
        );
        revalidator.revalidate();
        setTimeout(() => {
          onOpenChange(false);
        }, 500);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error saving todo:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            {todo ? "Edit Order" : "Add New Order"}
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="orderNUmber" className="text-right">
              # Order
            </Label>
            <Input
              id="order-number"
              type="number"
              min="6"
              value={formData.orderNumber}
              onChange={(e) =>
                handleChange("orderNumber", parseInt(e.target.value) || 0)
              }
              required
              className="col-span-3 dark:bg-gray-300 dark:text-black"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pages" className="text-right">
              Pages
            </Label>
            <Input
              id="pages"
              type="number"
              min="1"
              value={formData.pages}
              onChange={(e) => handleChange("pages", parseInt(e.target.value))}
              required
              className="col-span-3 dark:bg-gray-300 dark:text-black"
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
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignedTo" className="text-right">
              Assignee
            </Label>
            <Select
              value={formData.assignedTo}
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
              Notes
            </Label>
            <Textarea
              id="note"
              value={formData.note || ""}
              onChange={(e) => handleChange("note", e.target.value)}
              className="col-span-3 dark:focus:bg-gray-100 dark:focus:text-black"
              placeholder="Your personal notes for this order.."
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
                checked={formData.completed as boolean}
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
        <DialogFooter className="flex flex-row-reverse gap-6">
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
