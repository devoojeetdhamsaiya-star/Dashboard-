
export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'paid' | 'pending' | 'overdue';

export interface Transaction {
  id: string;
  date: string;
  category: string;
  amount: number;
  type: TransactionType;
  description: string;
  status?: TransactionStatus;
  entity?: string; // Debtor/Creditor name
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactions: Transaction[];
  categoryData: { name: string; value: number; type: TransactionType }[];
  monthlyData: { month: string; income: number; expense: number }[];
  profitMargin: number;
  cashInflow: number;
  cashOutflow: number;
  debtorsTotal: number;
}

export const CATEGORIES = {
  income: ['Salary', 'Freelance', 'Investments', 'Gift', 'Other'],
  expense: ['Food', 'Rent', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other']
};
