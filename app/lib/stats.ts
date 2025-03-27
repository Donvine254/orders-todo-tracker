import { TodoOrder } from "~/types";

export const getStats = (data: TodoOrder[]) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      dueToday: data.filter((todo) => {
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0);
        return !todo.completed && dueDate.getTime() === today.getTime();
      }).length,

      overdue: data.filter((todo) => {
        const dueDate = new Date(todo.dueDate);
        return (
          !todo.completed &&
          dueDate < new Date() &&
          dueDate.toDateString() !== today.toDateString()
        );
      }).length,

      inProgress: data.filter((todo) => !todo.completed).length,

      completed: data.filter((todo) => todo.completed).length,
    };
  } catch (error) {
    console.error("Service error getting todo stats:", error);
    return {
      dueToday: 0,
      overdue: 0,
      inProgress: 0,
      completed: 0,
    };
  }
};
