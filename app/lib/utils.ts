import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isToday, isBefore, isAfter, isSameDay } from 'date-fns';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const formatDate = (date: Date): string => {
  return format(date, 'MMMM d, yyyy');
};

export const formatDateTime = (date: Date): string => {
  return format(date, 'M/d/yy h:mm a');
};

export const formatDateForInput = (date: Date): string => {
  return format(date, 'yyyy-MM-dd\'T\'HH:mm');
};

export const isDueToday = (date: Date): boolean => {
  return isToday(date);
};

export const isOverdue = (date: Date): boolean => {
  return isBefore(date, new Date()) && !isToday(date);
};

export const isDueLater = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return isAfter(date, tomorrow) || isSameDay(date, tomorrow);
};