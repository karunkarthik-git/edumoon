
import { useEffect, useState } from 'react';
import './App.css';
import { fetchSheetData } from './utils/fetchSheetData';



function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  // Only one color mode, so no darkMode state

  useEffect(() => {
    setLoading(true);
    fetchSheetData()
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        setLoading(false);
      });
  }, []);


  // Remove first 2 columns and add S. No
  const getDisplayUsers = (arr) => {
    return arr.map((u, idx) => {
      const entries = Object.entries(u);
      // Remove first 2 columns (Timestamp, Email Address)
      const filteredEntries = entries.slice(2);
      return {
        sno: idx + 1,
        ...Object.fromEntries(filteredEntries)
      };
    });
  };

  // Filter users by email (original users array)
  const filtered = users.filter(u =>
    u['Email Address']?.toLowerCase().includes(search.toLowerCase())
  );
  const displayUsers = getDisplayUsers(filtered);
  const displayColumns = displayUsers[0] ? Object.keys(displayUsers[0]) : [];


  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Removed dark mode toggle

  const handlePrev = () => setPage(p => Math.max(1, p - 1));
  const handleNext = () => setPage(p => Math.min(totalPages, p + 1));

  return (
    <div className="dark-theme">
      <div className="header-bar">
        <h1 className="main-title">Edumoon Assignment Submissions</h1>
        <div className="search-bar-wrapper">
          <input
            className="search-bar"
            type="text"
            placeholder="Search by Email Address..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>
      {loading ? (
        <div className="card-list-responsive">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="user-card skeleton-card" key={i}>
              <div className="skeleton skeleton-title" />
              {Array.from({ length: 5 }).map((_, j) => (
                <div className="skeleton skeleton-row" key={j} />
              ))}
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="no-results">{error}</div>
      ) : displayUsers.length === 0 ? (
        <div className="no-results">No results found.</div>
      ) : (
        <div className="card-list-responsive">
          {displayUsers.map((user, idx) => (
            <div className="user-card" key={idx}>
              <div className="user-card-row user-card-sno"><span>{user.sno}</span></div>
              {displayColumns.filter(col => col !== 'sno').map((col, i) => (
                <div className="user-card-row" key={i}>
                  <span className="user-card-label">{col}:</span>
                  <span className="user-card-value">
                    {typeof user[col] === 'string' && user[col].startsWith('http') ? (
                      <a className="modern-link" href={user[col]} target="_blank" rel="noopener noreferrer">
                        <span className="link-label">{user[col].replace(/^https?:\/\//, '').split(/[/?#]/)[0]}</span>
                        <span className="link-icon" aria-label="external link">↗</span>
                      </a>
                    ) : user[col]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App
