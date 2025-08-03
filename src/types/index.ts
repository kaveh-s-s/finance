export interface ExpenseItem {
  date: string;
  amount: number;
  category: string;
  description?: string;
  kavehShare: number;
  negarShare: number;
}

export interface ParsedCSVData {
  data: ExpenseItem[];
  error: boolean;
  message?: string;
}

export interface CategoryTotal {
  category: string;
  amount: number;
}

export interface MonthlyExpenseData {
  name: string; // Month name
  [category: string]: string | number; // Dynamic category fields with amounts
  total: number;
}

export interface CreditEntry {
  Date: string;
  Description: string;
  Out: number;
  In: number;
  Flag1: string;
  Flag2: string;
  Kaveh: number;
  Negar: number;
  Card: string;
}

export type AccountType = 'Kaveh Credit' | 'Kaveh Debit' | 'Kaveh Sparkasse' | 'Negar Credit';