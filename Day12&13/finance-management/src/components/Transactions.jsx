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

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ amount: '', category: CATEGORIES[0], type: 'expense', date: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', category: CATEGORIES[0], type: 'expense', date: '', description: '' });
  const [alert, setAlert] = useState('');
  const month = getCurrentMonth();

  useEffect(() => {
    setTransactions(JSON.parse(localStorage.getItem('transactions')) || []);
    setBudgets(JSON.parse(localStorage.getItem('budgets')) || []);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!form.amount || !form.category || !form.type || !form.date) return;
    const newTxn = {
      id: `txn_${Date.now()}`,
      ...form,
      amount: Number(form.amount)
    };
    const updatedTxns = [...transactions, newTxn];
    setTransactions(updatedTxns);
    localStorage.setItem('transactions', JSON.stringify(updatedTxns));
    setForm({ amount: '', category: CATEGORIES[0], type: 'expense', date: '', description: '' });
    // Budget alert logic
    const budget = budgets.find(b => b.category === newTxn.category && b.month === month);
    if (budget) {
      const spent = updatedTxns
        .filter(t => t.category === budget.category && t.type === 'expense' && t.date.startsWith(month))
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
      if (spent > budget.limit) {
        setAlert(`Alert: You have exceeded your ${budget.category} budget for this month!`);
      } else {
        setAlert('');
      }
    }
  };

  const handleEditTransaction = (id) => {
    const txn = transactions.find(t => t.id === id);
    setEditId(id);
    setEditForm({ ...txn });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = (id) => {
    const updatedTxns = transactions.map(t =>
      t.id === id ? { ...editForm, id, amount: Number(editForm.amount) } : t
    );
    setTransactions(updatedTxns);
    localStorage.setItem('transactions', JSON.stringify(updatedTxns));
    setEditId(null);
    setEditForm({ amount: '', category: CATEGORIES[0], type: 'expense', date: '', description: '' });
  };

  const handleDeleteTransaction = (id) => {
    const updatedTxns = transactions.filter(t => t.id !== id);
    setTransactions(updatedTxns);
    localStorage.setItem('transactions', JSON.stringify(updatedTxns));
  };

  return (
    <div>
      <div className="glass-card">
        <h2>Transactions</h2>
        {alert && <div className="alert alert-danger">{alert}</div>}
        <form className="mb-4" onSubmit={handleAddTransaction}>
          <div className="row g-2">
            <div className="col">
              <input className="glass-input" type="number" name="amount" placeholder="Amount" value={form.amount} onChange={handleChange} />
            </div>
            <div className="col">
              <select className="glass-select" name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="col">
              <select className="glass-select" name="type" value={form.type} onChange={handleChange}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="col">
              <input className="glass-input" type="date" name="date" value={form.date} onChange={handleChange} />
            </div>
            <div className="col">
              <input className="glass-input" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            </div>
            <div className="col-auto">
              <button className="glass-btn" type="submit">Add</button>
            </div>
          </div>
        </form>
        <div className="responsive-table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Type</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(txn => (
                <tr key={txn.id}>
                  {editId === txn.id ? (
                    <>
                      <td><input type="date" className="glass-input" name="date" value={editForm.date} onChange={handleEditChange} /></td>
                      <td><input type="number" className="glass-input" name="amount" value={editForm.amount} onChange={handleEditChange} /></td>
                      <td>
                        <select className="glass-select" name="category" value={editForm.category} onChange={handleEditChange}>
                          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </td>
                      <td>
                        <select className="glass-select" name="type" value={editForm.type} onChange={handleEditChange}>
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </td>
                      <td><input className="glass-input" name="description" value={editForm.description} onChange={handleEditChange} /></td>
                      <td>
                        <button className="glass-btn btn-sm me-2" onClick={() => handleSaveEdit(txn.id)}>Save</button>
                        <button className="glass-btn btn-sm" style={{background:'#e0e7ff',color:'#222'}} onClick={() => setEditId(null)}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{txn.date}</td>
                      <td>{txn.amount}</td>
                      <td>{txn.category}</td>
                      <td>{txn.type}</td>
                      <td>{txn.description}</td>
                      <td>
                        <button className="glass-btn btn-sm me-2" style={{background:'#f59e42'}} onClick={() => handleEditTransaction(txn.id)}>Edit</button>
                        <button className="glass-btn btn-sm" style={{background:'#ef4444'}} onClick={() => handleDeleteTransaction(txn.id)}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
