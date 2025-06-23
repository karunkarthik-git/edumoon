import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import '../glass.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES = [
  'Food',
  'Entertainment',
  'Transport',
  'Utilities',
  'Shopping',
  'Health',
  'Salary',
  'Other',
  'Goal Contribution'
];

// Placeholder for dashboard overview
export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    setTransactions(JSON.parse(localStorage.getItem('transactions')) || []);
    setGoals(JSON.parse(localStorage.getItem('goals')) || []);
  }, []);

  // Pie chart for expenses by category (current month)
  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  // Group all transactions by category for the current month
  const categoryTotals = {};
  transactions.forEach(t => {
    if (t.type === 'expense' && t.date && t.date.startsWith(month)) {
      if (!categoryTotals[t.category]) categoryTotals[t.category] = 0;
      categoryTotals[t.category] += Math.abs(Number(t.amount));
    }
  });
  // If a category has no transactions, show it as 0 (optional: comment out if you want to show only categories with data)
  CATEGORIES.forEach(cat => {
    if (!(cat in categoryTotals)) categoryTotals[cat] = 0;
  });
  const expensePieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8BC34A', '#607D8B', '#FFD700'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Pie chart for goal progress (portion saved vs. remaining for each goal)
  const goalPieData = {
    labels: goals.map(g => g.name),
    datasets: [
      {
        data: goals.map(g => {
          const saved = transactions
            .filter(t => t.goalId === g.id)
            .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
          return saved;
        }),
        label: 'Saved',
        backgroundColor: [
          '#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8BC34A', '#607D8B', '#FFD700'
        ],
        borderWidth: 1,
      },
      {
        data: goals.map(g => Math.max(0, g.target - transactions
          .filter(t => t.goalId === g.id)
          .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0))),
        label: 'Remaining',
        backgroundColor: [
          '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575', '#616161', '#424242', '#212121', '#B0BEC5', '#CFD8DC'
        ],
        borderWidth: 1,
      }
    ]
  };

  return (
    <div className="glass-card">
      <h2>Dashboard</h2>
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="glass-section">
            <h5><span role="img" aria-label="pie">📊</span> Expenses by Category (This Month)</h5>
            <Pie data={expensePieData} />
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="glass-section">
            <h5><span role="img" aria-label="goal">🎯</span> Goal Progress</h5>
            {goals.length > 0 ? <Pie data={goalPieData} /> : <div style={{textAlign:'center'}}>No goals yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
