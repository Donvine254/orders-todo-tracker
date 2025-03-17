export type Priority = "low" | "medium" | "high";
export type Assignee = "Jecinta" | "Donvine" | "Mwambire" | "";

export interface TodoOrder {
  id: string;
  orderNumber: string;
  pages: number;
  dueDate: Date;
  priority: Priority;
  assignedTo: string;
  note?: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoStats {
  dueToday: number;
  overdue: number;
  inProgress: number;
  completed: number;
}
