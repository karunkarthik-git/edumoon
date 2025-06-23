import { useState, useEffect } from 'react';
import '../glass.css';

// Placeholder for goals
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [alert, setAlert] = useState('');
  const [contributionTxn, setContributionTxn] = useState({ amount: '', goalId: '', date: '', description: '' });

  // Load goals and transactions from localStorage
  useEffect(() => {
    setGoals(JSON.parse(localStorage.getItem('goals')) || []);
    setTransactions(JSON.parse(localStorage.getItem('transactions')) || []);
  }, []);

  // Add new goal
  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!name || !target || !deadline) return;
    const newGoal = {
      id: `goal_${Date.now()}`,
      name,
      target: Number(target),
      deadline,
    };
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    localStorage.setItem('goals', JSON.stringify(updatedGoals));
    setName('');
    setTarget('');
    setDeadline('');
  };

  // Add contribution transaction
  const handleAddContribution = (e) => {
    e.preventDefault();
    if (!contributionTxn.amount || !contributionTxn.goalId || !contributionTxn.date) return;
    const newTxn = {
      id: `txn_${Date.now()}`,
      amount: Number(contributionTxn.amount),
      category: 'Goal Contribution',
      type: 'expense',
      date: contributionTxn.date,
      description: contributionTxn.description || 'Goal Contribution',
      goalId: contributionTxn.goalId
    };
    const updatedTxns = [...transactions, newTxn];
    setTransactions(updatedTxns);
    localStorage.setItem('transactions', JSON.stringify(updatedTxns));
    setContributionTxn({ amount: '', goalId: '', date: '', description: '' });
  };

  // Calculate progress for each goal
  const getGoalProgress = (goalId) => {
    return transactions
      .filter(t => t.goalId === goalId)
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
  };

  return (
    <div className="glass-card">
      <h2>Goals</h2>
      {alert && <div className="alert alert-danger">{alert}</div>}
      <form className="mb-4" onSubmit={handleAddGoal}>
        <div className="row g-2 align-items-end">
          <div className="col">
            <input className="glass-input" placeholder="Goal Name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="col">
            <input className="glass-input" type="number" placeholder="Target Amount" value={target} onChange={e => setTarget(e.target.value)} />
          </div>
          <div className="col">
            <input className="glass-input" type="date" placeholder="Deadline" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>
          <div className="col-auto">
            <button className="glass-btn" type="submit">Add Goal</button>
          </div>
        </div>
      </form>
      <form className="mb-4" onSubmit={handleAddContribution}>
        <div className="row g-2 align-items-end">
          <div className="col">
            <select className="glass-select" value={contributionTxn.goalId} onChange={e => setContributionTxn({ ...contributionTxn, goalId: e.target.value })}>
              <option value="">Select Goal</option>
              {goals.map(goal => <option key={goal.id} value={goal.id}>{goal.name}</option>)}
            </select>
          </div>
          <div className="col">
            <input className="glass-input" type="number" placeholder="Amount" value={contributionTxn.amount} onChange={e => setContributionTxn({ ...contributionTxn, amount: e.target.value })} />
          </div>
          <div className="col">
            <input className="glass-input" type="date" value={contributionTxn.date} onChange={e => setContributionTxn({ ...contributionTxn, date: e.target.value })} />
          </div>
          <div className="col">
            <input className="glass-input" placeholder="Description" value={contributionTxn.description} onChange={e => setContributionTxn({ ...contributionTxn, description: e.target.value })} />
          </div>
          <div className="col-auto">
            <button className="glass-btn" type="submit">Add Contribution</button>
          </div>
        </div>
      </form>
      <div className="responsive-table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Goal</th>
              <th>Target</th>
              <th>Saved</th>
              <th>Deadline</th>
              <th>Progress</th>
            </tr>
          </thead>
          <tbody>
            {goals.map(goal => {
              const saved = getGoalProgress(goal.id);
              const percent = Math.min(100, Math.round((saved / goal.target) * 100));
              return (
                <tr key={goal.id}>
                  <td>{goal.name}</td>
                  <td>{goal.target}</td>
                  <td>{saved}</td>
                  <td>{goal.deadline}</td>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
