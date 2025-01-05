import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, "PP 'at' p");
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'dd-MM-yyyy');
};

export const getOrderStatusStyles = (status: string) => {
  const styles: Record<string, string> = {
    APPROVED: 'text-emerald-600 bg-emerald-50',
    SUBMITTED: 'text-emerald-600 bg-emerald-50',
    REJECTED: 'text-red-600 bg-red-50',
    PENDING: 'text-amber-600 bg-amber-50',
    CLARIFICATION: 'text-amber-600 bg-amber-50',
    IN_PROGRESS: 'text-blue-600 bg-blue-50',
    ON_HOLD: 'text-gray-600 bg-gray-50',
    CANCELLED: 'text-red-600 bg-red-50',
    COMPLETED: 'text-emerald-600 bg-emerald-50',
  };

  return styles[status] || '';
};
