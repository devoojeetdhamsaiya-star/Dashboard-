
import * as XLSX from 'xlsx';
import { Transaction, DashboardData, TransactionType } from '../types';
import { format, parseISO, startOfMonth } from 'date-fns';

export function parseExcel(file: File): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet) as any[];

        const transactions: Transaction[] = json.map((row, index) => ({
          id: `excel-${index}-${Date.now()}`,
          date: row.Date || row.date || new Date().toISOString(),
          category: row.Category || row.category || 'Other',
          amount: parseFloat(row.Amount || row.amount || 0),
          type: (row.Type || row.type || 'expense').toLowerCase() as TransactionType,
          description: row.Description || row.description || '',
        }));

        resolve(transactions);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsBinaryString(file);
  });
}

export function processDashboardData(transactions: Transaction[]): DashboardData {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;
  
  const cashInflow = transactions
    .filter(t => t.type === 'income' && t.status === 'paid')
    .reduce((acc, t) => acc + t.amount, 0);
    
  const cashOutflow = transactions
    .filter(t => t.type === 'expense' && t.status === 'paid')
    .reduce((acc, t) => acc + t.amount, 0);

  const debtorsTotal = transactions
    .filter(t => t.type === 'income' && (t.status === 'pending' || t.status === 'overdue'))
    .reduce((acc, t) => acc + t.amount, 0);

  // Category data for Pie Charts
  const categoryMap: Record<string, { value: number; type: TransactionType }> = {};
  transactions.forEach((t) => {
    const key = `${t.type}-${t.category}`;
    if (!categoryMap[key]) {
      categoryMap[key] = { value: 0, type: t.type };
    }
    categoryMap[key].value += t.amount;
  });

  const categoryData = Object.entries(categoryMap).map(([key, data]) => ({
    name: key.split('-')[1],
    value: data.value,
    type: data.type,
  }));

  // Monthly data for Line Charts
  const monthlyMap: Record<string, { income: number; expense: number }> = {};
  transactions.forEach((t) => {
    const monthKey = format(startOfMonth(parseISO(t.date)), 'MMM yyyy');
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { income: 0, expense: 0 };
    }
    if (t.type === 'income') {
      monthlyMap[monthKey].income += t.amount;
    } else {
      monthlyMap[monthKey].expense += t.amount;
    }
  });

  const monthlyData = Object.entries(monthlyMap)
    .map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense,
    }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  return {
    totalIncome,
    totalExpenses,
    balance,
    transactions,
    categoryData,
    monthlyData,
    profitMargin,
    cashInflow,
    cashOutflow,
    debtorsTotal
  };
}

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', date: '2024-03-01T10:00:00Z', category: 'Salary', amount: 500000, type: 'income', description: 'Monthly Salary', status: 'paid' },
  { id: '2', date: '2024-03-05T10:00:00Z', category: 'Rent', amount: 150000, type: 'expense', description: 'Office Rent', status: 'paid' },
  { id: '3', date: '2024-03-10T10:00:00Z', category: 'Freelance', amount: 80000, type: 'income', description: 'Client A - UI/UX', status: 'pending', entity: 'TechCorp' },
  { id: '4', date: '2024-03-15T10:00:00Z', category: 'Investments', amount: 30000, type: 'income', description: 'Dividends', status: 'paid' },
  { id: '5', date: '2024-03-20T10:00:00Z', category: 'Transport', amount: 12000, type: 'expense', description: 'Logistics', status: 'overdue' },
  { id: '6', date: '2024-03-22T10:00:00Z', category: 'Freelance', amount: 120000, type: 'income', description: 'Client B - App Dev', status: 'overdue', entity: 'FutureSoft' },
];
