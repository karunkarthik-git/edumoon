import { useState, useEffect } from 'react';
import '../glass.css';

const CATEGORIES = [
  'Food',
  'Entertainment',
  'Transport',
  'Utilities',
  'Shopping',
  'Health',
  'Salary',
  'Other'
];

// Helper to get current month in YYYY-MM
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

// Placeholder for budgets
export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [limit, setLimit] = useState('');
  const [alert, setAlert] = useState('');
  const [editId, setEditId] = useState(null);
  const [editLimit, setEditLimit] = useState('');
  const [period] = useState('monthly');
  const [month] = useState(getCurrentMonth());

  // Load budgets and transactions from localStorage
  useEffect(() => {
    setBudgets(JSON.parse(localStorage.getItem('budgets')) || []);
    setTransactions(JSON.parse(localStorage.getItem('transactions')) || []);
  }, []);

  // Add new budget
  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!category || !limit) return;
    // Prevent duplicate category for the same month
    if (budgets.some(b => b.category === category && b.month === month)) return;
    const newBudget = {
      id: `budget_${Date.now()}`,
      category,
      limit: Number(limit),
      period,
      month
    };
    const updatedBudgets = [...budgets, newBudget];
    setBudgets(updatedBudgets);
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
    setCategory(CATEGORIES[0]);
    setLimit('');
  };

  // Edit budget
  const handleEditBudget = (id) => {
    const budget = budgets.find(b => b.id === id);
    setEditId(id);
    setEditLimit(budget.limit);
  };

  // Save edited budget
  const handleSaveEdit = (id) => {
    const updatedBudgets = budgets.map(b =>
      b.id === id ? { ...b, limit: Number(editLimit) } : b
    );
    setBudgets(updatedBudgets);
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
    setEditId(null);
    setEditLimit('');
  };

  // Delete budget
  const handleDeleteBudget = (id) => {
    const updatedBudgets = budgets.filter(b => b.id !== id);
    setBudgets(updatedBudgets);
    localStorage.setItem('budgets', JSON.stringify(updatedBudgets));
  };

  // Calculate spent per budget for current month
  const getSpent = (cat) => {
    return transactions
      .filter(t => t.category === cat && t.type === 'expense' && t.date.startsWith(month))
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
  };

  // Budget alert logic
  useEffect(() => {
    budgets.forEach(budget => {
      const spent = getSpent(budget.category);
      if (spent > budget.limit && budget.month === month) {
        setAlert(`Alert: You have exceeded your ${budget.category} budget for this month!`);
      }
    });
  }, [budgets, transactions, month]);

  return (
    <div>
      <div className="glass-card">
        <h2>Budgets</h2>
        {alert && <div className="alert alert-danger">{alert}</div>}
        <form className="mb-4" onSubmit={handleAddBudget}>
          <div className="row g-2">
            <div className="col">
              <select className="glass-select" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="col">
              <input className="glass-input" type="number" placeholder="Limit" value={limit} onChange={e => setLimit(e.target.value)} />
            </div>
            <div className="col-auto">
              <button className="glass-btn" type="submit">Add Budget</button>
            </div>
          </div>
        </form>
        <div className="responsive-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Limit</th>
                <th>Spent</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.filter(b => b.month === month).map(budget => {
                const spent = getSpent(budget.category);
                const percent = Math.min(100, Math.round((spent / budget.limit) * 100));
                return (
                  <tr key={budget.id}>
                    <td>{budget.category}</td>
                    <td>
                      {editId === budget.id ? (
                        <input
                          type="number"
                          className="glass-input"
                          value={editLimit}
                          onChange={e => setEditLimit(e.target.value)}
                          style={{ width: 80 }}
                        />
                      ) : (
                        budget.limit
                      )}
                    </td>
                    <td>{spent}</td>
                    <td>
                      <div className="glass-progress">
                        <div
                          className="glass-progress-bar"
                          style={{ width: `${percent}%` }}
                        >
                          {percent}%
                        </div>
                      </div>
                    </td>
                    <td>
                      {editId === budget.id ? (
                        <>
                          <button className="glass-btn btn-sm me-2" onClick={() => handleSaveEdit(budget.id)}>Save</button>
                          <button className="glass-btn btn-sm" style={{background:'#e0e7ff',color:'#222'}} onClick={() => setEditId(null)}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="glass-btn btn-sm me-2" style={{background:'#f59e42'}} onClick={() => handleEditBudget(budget.id)}>Edit</button>
                          <button className="glass-btn btn-sm" style={{background:'#ef4444'}} onClick={() => handleDeleteBudget(budget.id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
