import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation
} from 'react-router-dom';
import { useEffect } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budgets from './components/Budgets';
import Reports from './components/Reports';
import Goals from './components/Goals';
import Navbar from './components/Navbar';
import './glass.css';

function AppContent() {
  const location = useLocation();
  location.state = {
    from: location.pathname,
    search: location.search
  }
  console.log(location);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    // If not logged in or user data missing, redirect to /auth (except on /auth)
    if ((!token || !user) && location.pathname !== '/auth') {
      window.location.href = '/auth';
    }
  }, [location]);
  return (
    <div className="container py-4">
      <h1 style={{
        textAlign: 'center',
        fontWeight: 800,
        fontSize: '2.5rem',
        letterSpacing: '-1.5px',
        color: '#274690',
        marginBottom: '2.5rem',
        fontFamily: 'Montserrat, Inter, Segoe UI, Arial, sans-serif',
        textShadow: '0 2px 12px rgba(80,112,255,0.08)'
      }}>
        FinSight
      </h1>
      {location.pathname !== '/auth' && <Navbar />}
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
