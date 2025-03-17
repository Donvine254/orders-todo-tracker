
export type Priority = 'Low' | 'Medium' | 'High';
export type Assignee = 'Jecinta' | 'Donvine' | 'Mwambire' | '';

export interface TodoOrder {
  id: string;
  orderNumber: string;
  pages: number;
  dueDate: Date;
  priority: Priority;
  assignedTo: string;
  note: string;
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