import { TodoOrder, TodoStats } from "~/types";

// Function to generate a random order number
const generateOrderNumber = (): string => {
  return Math.floor(7000000 + Math.random() * 3000000).toString();
};

// Generate sample data
const generateSampleData = (): TodoOrder[] => {
  const today = new Date();

  // Helper function to create a date relative to today
  const createDate = (
    dayOffset: number,
    hours: number,
    minutes: number
  ): Date => {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return [
    {
      id: "1",
      orderNumber: "7227442",
      pages: 3,
      dueDate: createDate(-1, 8, 3),
      priority: "low",
      assignedTo: "Jecinta",
      note: "Submitted",
      completed: true,
      createdAt: createDate(-3, 10, 0),
      updatedAt: createDate(-1, 15, 0),
    },
    {
      id: "2",
      orderNumber: "7985733",
      pages: 1,
      dueDate: createDate(1, 14, 46),
      priority: "high",
      assignedTo: "Mwambire",
      note: "Pending revision",
      completed: false,
      createdAt: createDate(-2, 9, 0),
      updatedAt: createDate(-2, 9, 0),
    },
    {
      id: "3",
      orderNumber: "7985953",
      pages: 1,
      dueDate: createDate(2, 0, 3),
      priority: "medium",
      assignedTo: "Jecinta",
      note: "",
      completed: false,
      createdAt: createDate(-1, 12, 0),
      updatedAt: createDate(-1, 12, 0),
    },
    {
      id: "4",
      orderNumber: "7985967",
      pages: 1,
      dueDate: createDate(2, 0, 3),
      priority: "high",
      assignedTo: "",
      note: "Pending clarification",
      completed: false,
      createdAt: createDate(-1, 14, 30),
      updatedAt: createDate(-1, 14, 30),
    },
    {
      id: "5",
      orderNumber: "7985632",
      pages: 2,
      dueDate: createDate(2, 7, 3),
      priority: "low",
      assignedTo: "Donvine",
      note: "Completed but not uploaded",
      completed: true,
      createdAt: createDate(-2, 11, 0),
      updatedAt: createDate(0, 16, 0),
    },
    {
      id: "6",
      orderNumber: "7984756",
      pages: 7,
      dueDate: createDate(2, 23, 3),
      priority: "low",
      assignedTo: "Donvine",
      note: "",
      completed: false,
      createdAt: createDate(-3, 8, 0),
      updatedAt: createDate(-3, 8, 0),
    },
    {
      id: "7",
      orderNumber: "7985970",
      pages: 4,
      dueDate: createDate(3, 10, 3),
      priority: "medium",
      assignedTo: "",
      note: "",
      completed: false,
      createdAt: createDate(-1, 9, 0),
      updatedAt: createDate(-1, 9, 0),
    },
  ];
};

// Initialize local storage with sample data if empty
const initializeLocalStorage = (): void => {
  const todos = localStorage.getItem("todos");
  if (!todos) {
    localStorage.setItem("todos", JSON.stringify(generateSampleData()));
  }
};

// Get all todos from local storage
export const getTodos = (): TodoOrder[] => {
  initializeLocalStorage();
  const todos = localStorage.getItem("todos");
  const parsedTodos = JSON.parse(todos || "[]");

  // Convert string dates back to Date objects
  //   eslint-ignore-next-line
  return parsedTodos.map((todo: TodoOrder) => ({
    ...todo,
    dueDate: new Date(todo.dueDate),
    createdAt: new Date(todo.createdAt),
    updatedAt: new Date(todo.updatedAt),
  }));
};

// Add a new todo
export const addTodo = (
  todo: Omit<TodoOrder, "id" | "orderNumber" | "createdAt" | "updatedAt">
): TodoOrder => {
  const todos = getTodos();
  const now = new Date();

  const newTodo: TodoOrder = {
    ...todo,
    id: Date.now().toString(),
    orderNumber: generateOrderNumber(),
    createdAt: now,
    updatedAt: now,
  };

  const updatedTodos = [...todos, newTodo];
  localStorage.setItem("todos", JSON.stringify(updatedTodos));

  return newTodo;
};

// Update an existing todo
export const updateTodo = (
  id: string,
  updates: Partial<TodoOrder>
): TodoOrder | null => {
  const todos = getTodos();
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) return null;

  const updatedTodo = {
    ...todos[todoIndex],
    ...updates,
    updatedAt: new Date(),
  };

  todos[todoIndex] = updatedTodo;
  localStorage.setItem("todos", JSON.stringify(todos));

  return updatedTodo;
};

// Delete a todo
export const deleteTodo = (id: string): boolean => {
  const todos = getTodos();
  const filteredTodos = todos.filter((todo) => todo.id !== id);

  if (filteredTodos.length === todos.length) return false;

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
  return true;
};

// Toggle todo completion status
export const toggleTodoCompletion = (id: string): TodoOrder | null => {
  const todos = getTodos();
  const todo = todos.find((todo) => todo.id === id);

  if (!todo) return null;

  return updateTodo(id, { completed: !todo.completed });
};

// Get todo statistics
export const getTodoStats = (): TodoStats => {
  const todos = getTodos();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    dueToday: todos.filter((todo) => {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return !todo.completed && dueDate.getTime() === today.getTime();
    }).length,

    overdue: todos.filter((todo) => {
      const dueDate = new Date(todo.dueDate);
      return (
        !todo.completed &&
        dueDate < new Date() &&
        dueDate.toDateString() !== today.toDateString()
      );
    }).length,

    inProgress: todos.filter((todo) => !todo.completed).length,

    completed: todos.filter((todo) => todo.completed).length,
  };
};
