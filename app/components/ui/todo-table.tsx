import { useState, useEffect } from "react";
import { getTodos, toggleTodoCompletion, deleteTodo } from "~/lib/todo";
import { TodoOrder } from "~/types";
import { formatDateTime, isOverdue, isDueToday } from "~/lib/utils";
import { Checkbox } from "./checkbox";
import { Button } from "./button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import EditTodoDialog from "./edit-dialog";
import { motion, AnimatePresence } from "framer-motion";
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

const TodoTable = () => {
  const [todos, setTodos] = useState<TodoOrder[]>([]);
  const [editingTodo, setEditingTodo] = useState<TodoOrder | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<string | null>(null);

  useEffect(() => {
    refreshTodos();
  }, []);

  const refreshTodos = () => {
    setTodos(getTodos());
  };

  const handleToggleCompletion = (id: string) => {
    const result = toggleTodoCompletion(id);
    if (result) {
      refreshTodos();
      toast.success("Task status updated");
    }
  };

  const handleEdit = (todo: TodoOrder) => {
    setEditingTodo(todo);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setTodoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (todoToDelete) {
      const success = deleteTodo(todoToDelete);
      if (success) {
        refreshTodos();
        toast.success("Order deleted successfully");
      } else {
        toast.error("Failed to delete order");
      }
      setTodoToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-todo-high";
      case "Medium":
        return "bg-todo-medium";
      case "Low":
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

  return (
    <>
      <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 animate-fadeIn">
        <table className="orders-table">
          <thead>
            <tr>
              <th className="w-16">Status</th>
              <th className="w-32"># Order</th>
              <th className="w-20">Pages</th>
              <th className="w-40 whitespace-nowrap">Due date</th>
              <th className="w-28">Priority</th>
              <th className="w-32">Assigned to</th>
              <th>Note</th>
              <th className="w-24 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {todos.map((todo) => (
                <motion.tr
                  key={todo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className={getRowClassName(todo)}>
                  <td className="text-center">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleCompletion(todo.id)}
                      className="data-[state=checked]:bg-todo-primary data-[state=checked]:border-todo-primary"
                    />
                  </td>
                  <td>{todo.orderNumber}</td>
                  <td>{todo.pages}</td>
                  <td
                    className={`whitespace-nowrap ${
                      isOverdue(new Date(todo.dueDate)) && !todo.completed
                        ? "text-red-600 dark:text-red-400 font-medium"
                        : ""
                    }`}>
                    {formatDateTime(new Date(todo.dueDate))}
                  </td>
                  <td>
                    <span
                      className={`priority-tag ${getPriorityStyles(
                        todo.priority
                      )}`}>
                      {todo.priority}
                    </span>
                  </td>
                  <td>{todo.assignedTo}</td>
                  <td>{todo.note}</td>
                  <td>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(todo)}
                        className="h-8 w-8 text-gray-500 hover:text-todo-primary dark:text-gray-400 dark:hover:text-todo-primary">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(todo.id)}
                        className="h-8 w-8 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <EditTodoDialog
        todo={editingTodo}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={refreshTodos}
      />

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
    </>
  );
};

export default TodoTable;
