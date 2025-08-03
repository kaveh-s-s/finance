import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ExpenseData {
  YearMonth: string;
  Flag1: string;
  sum_out_times: number;
}

interface ExpenseChartProps {
  data: ExpenseData[];
  person: 'Kaveh' | 'Negar' | 'both';
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ data, person }) => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#1A535C',
    '#F9C80E', '#FF8C42', '#54478C', '#2EC4B6', '#5E2BFF',
    '#FF595E', '#8AC926', '#3A86FF', '#FB5607', '#FFBE0B'
  ];

  // Group data by month
  const monthlyData = data.reduce((acc, item) => {
    const month = acc.find(m => m.month === item.YearMonth);
    if (month) {
      month[item.Flag1] = item.sum_out_times;
      month.total = (month.total || 0) + item.sum_out_times;
    } else {
      acc.push({
        month: item.YearMonth,
        [item.Flag1]: item.sum_out_times,
        total: item.sum_out_times
      });
    }
    return acc;
  }, [] as any[]).sort((a, b) => a.month.localeCompare(b.month));

  // Get unique categories
  const categories = Array.from(new Set(data.map(item => item.Flag1)));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Monthly Expenses by Category ({person === 'both' ? 'Total' : `${person}'s Share`})
      </h2>
      <div className="h-[600px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month" 
              label={{ value: 'Month', position: 'bottom', offset: 0 }}
              tickFormatter={(value) => {
                const [year, month] = value.split('-');
                return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' })} ${year}`;
              }}
            />
            <YAxis 
              tickFormatter={formatCurrency}
              label={{ value: 'Amount', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => {
                const [year, month] = label.split('-');
                return `${new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long' })} ${year}`;
              }}
            />
            <Legend />
            {categories.map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="a"
                fill={colors[index % colors.length]}
                name={category}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseChart;