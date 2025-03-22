export type Priority = "low" | "medium" | "high";
export type Assignee = "Jecinta" | "Donvine" | "Mwambire" | "";

export interface TodoOrder {
  id: string;
  orderNumber: string;
  pages: number;
  dueDate: string | Date;
  priority: Priority;
  assignedTo: string;
  note?: string | null;
  completed: boolean | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface OrderData {
  orderNumber: string;
  pages: number;
  dueDate: string;
  priority: Priority;
  assignedTo?: string;
  note?: string;
}

export interface TodoStats {
  dueToday: number;
  overdue: number;
  inProgress: number;
  completed: number;
}
