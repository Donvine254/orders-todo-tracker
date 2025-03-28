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
        const now = new Date();
        const twoHoursBefore = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        return (
          !todo.completed &&
          (dueDate <= twoHoursBefore ||
            (dueDate <= now && dueDate.toDateString() !== now.toDateString()))
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
