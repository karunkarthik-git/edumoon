import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../glass.css';

export default function Navbar() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {!isMobile && (
        <nav className="glass-card" style={{padding:'1rem 1.5rem', marginBottom:'2rem', display:'flex', gap:'0.5rem', justifyContent:'center', alignItems:'center'}}>
          {/* {!localStorage.getItem("user") && <Link to="/auth" className="btn btn-outline-primary me-2">Auth</Link>} */}
          {!localStorage.getItem("user") ? <Link to="/auth" className="glass-btn me-2">Auth</Link> : <button className="glass-btn me-2" style={{background:'#ef4444'}} onClick={() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            window.location.href = "/auth";
          }}>Logout</button>}
          <Link to="/dashboard" className="glass-btn me-2">Dashboard</Link>
          <Link to="/transactions" className="glass-btn me-2">Transactions</Link>
          <Link to="/budgets" className="glass-btn me-2">Budgets</Link>
          <Link to="/reports" className="glass-btn me-2">Reports</Link>
          <Link to="/goals" className="glass-btn">Goals</Link>
        </nav>
      )}
      {isMobile && (
        <nav className="glass-bottom-nav">
          <Link to="/dashboard" className="glass-btn" aria-label="Dashboard">
            <span role="img" aria-label="Dashboard">🏠</span>
            <span className="glass-bottom-nav-label">Dashboard</span>
          </Link>
          <Link to="/transactions" className="glass-btn" aria-label="Transactions">
            <span role="img" aria-label="Transactions">💸</span>
            <span className="glass-bottom-nav-label">Transactions</span>
          </Link>
          <Link to="/budgets" className="glass-btn" aria-label="Budgets">
            <span role="img" aria-label="Budgets">📊</span>
            <span className="glass-bottom-nav-label">Budgets</span>
          </Link>
          <Link to="/goals" className="glass-btn" aria-label="Goals">
            <span role="img" aria-label="Goals">🎯</span>
            <span className="glass-bottom-nav-label">Goals</span>
          </Link>
          <Link to="/reports" className="glass-btn" aria-label="Reports">
            <span role="img" aria-label="Reports">📈</span>
            <span className="glass-bottom-nav-label">Reports</span>
          </Link>
        </nav>
      )}
    </>
  );
}
