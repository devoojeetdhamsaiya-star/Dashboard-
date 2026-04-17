
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  BarChart, Bar, Legend, AreaChart, Area,
  ComposedChart, Scatter
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardData, TransactionType } from '../types';

const COLORS = {
  income: ['#00FF94', '#05FFB0', '#00D1FF', '#009669', '#10B981'],
  expense: ['#FF4D4D', '#FF6B6B', '#FF8A00', '#DC2626', '#EF4444'],
  neutral: ['#00D1FF', '#00A3FF', '#6366F1', '#4F46E5', '#3B82F6'],
};

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

const ChartCard = ({ title, children }: ChartCardProps) => (
  <Card className="h-[300px] overflow-hidden flex flex-col">
    <CardHeader className="py-4">
      <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-1 pb-4">
      {children}
    </CardContent>
  </Card>
);

export const ChartGrid = ({ data }: { data: DashboardData }) => {
  const incomeCategoryData = data.categoryData.filter(d => d.type === 'income');
  const expenseCategoryData = data.categoryData.filter(d => d.type === 'expense');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Income Distribution - Pie */}
      <ChartCard title="Income Distribution">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={incomeCategoryData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {incomeCategoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS.income[index % COLORS.income.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 2. Expense Distribution - Pie */}
      <ChartCard title="Expense Distribution">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={expenseCategoryData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label
            >
              {expenseCategoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS.expense[index % COLORS.expense.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 3. Monthly Comparison - Bar */}
      <ChartCard title="Monthly Comparison">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.monthlyData}>
            <XAxis dataKey="month" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Bar dataKey="income" fill={COLORS.income[0]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill={COLORS.expense[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 4. Income Trend - Line */}
      <ChartCard title="Income Trend">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.monthlyData}>
            <XAxis dataKey="month" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Line type="monotone" dataKey="income" stroke={COLORS.income[0]} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 5. Expense Trend - Line */}
      <ChartCard title="Expense Trend">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.monthlyData}>
            <XAxis dataKey="month" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Line type="monotone" dataKey="expense" stroke={COLORS.expense[0]} strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 6. Cumulative Balance - Area */}
      <ChartCard title="Cumulative Balance">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.monthlyData}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.neutral[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={COLORS.neutral[0]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="month" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Area type="monotone" dataKey={(v) => v.income - v.expense} name="Balance" stroke={COLORS.neutral[0]} fillOpacity={1} fill="url(#colorBalance)" />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 7. Category Mix - Doughnut */}
      <ChartCard title="All Category Mix">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data.categoryData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              dataKey="value"
            >
              {data.categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.type === 'income' ? COLORS.income[index % 5] : COLORS.expense[index % 5]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 8. Monthly Flow - Composed */}
      <ChartCard title="Financial Flow">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.monthlyData}>
            <XAxis dataKey="month" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Bar dataKey="income" barSize={20} fill={COLORS.income[1]} radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="expense" stroke={COLORS.expense[0]} strokeWidth={3} />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* 9. Income & Expense Scatter/Area */}
      <ChartCard title="Spread Analysis">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
            <XAxis dataKey="month" fontSize={10} />
            <YAxis fontSize={10} />
            <Tooltip />
            <Area type="step" dataKey="income" stroke={COLORS.income[0]} fill={COLORS.income[0]} fillOpacity={0.1} />
            <Area type="step" dataKey="expense" stroke={COLORS.expense[0]} fill={COLORS.expense[0]} fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};
