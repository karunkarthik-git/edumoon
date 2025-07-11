
import { useEffect, useState } from 'react';
import './App.css';
import { fetchSheetData } from './utils/fetchSheetData';



function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState({});
  const [sortBy, setSortBy] = useState('score-desc');
  const [scoreFilter, setScoreFilter] = useState('excellent');
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

  // Close tooltips when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.info-icon')) {
        setTooltipVisible({});
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


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

  // Filter by score if scoreFilter is not 'all'
  const scoreFiltered = filtered.filter(u => {
    if (scoreFilter === 'all') return true;
    
    // Check for flagged filter
    if (scoreFilter === 'flagged') {
      const remarksCol = Object.keys(u).find(key => key.toLowerCase().includes('remarks'));
      if (remarksCol) {
        return u[remarksCol]?.toString().toLowerCase().includes('flagged');
      }
      return false;
    }
    
    // For score-based filters, exclude flagged submissions
    const remarksCol = Object.keys(u).find(key => key.toLowerCase().includes('remarks'));
    if (remarksCol && u[remarksCol]?.toString().toLowerCase().includes('flagged')) {
      return false; // Exclude flagged submissions from score-based filters
    }
    
    // Find score column in the data
    const scoreCol = Object.keys(u).find(key => key.toLowerCase().includes('score'));
    if (!scoreCol) return true;
    
    // Parse score from "x/10" format
    const score = parseFloat(u[scoreCol]?.toString().split('/')[0] || '0');
    
    switch (scoreFilter) {
      case 'excellent': return score >= 9;
      case 'good': return score >= 7 && score < 9;
      case 'average': return score >= 5 && score < 7;
      case 'below-average': return score < 5;
      default: return true;
    }
  });

  // Sort users based on selected option
  const sortedUsers = [...scoreFiltered].sort((a, b) => {
    if (sortBy === 'score-asc' || sortBy === 'score-desc') {
      // Find score column in the data
      const scoreColA = Object.keys(a).find(key => key.toLowerCase().includes('score'));
      const scoreColB = Object.keys(b).find(key => key.toLowerCase().includes('score'));
      
      if (scoreColA && scoreColB) {
        // Parse score from "x/10" format
        const scoreA = parseFloat(a[scoreColA]?.toString().split('/')[0] || '0');
        const scoreB = parseFloat(b[scoreColB]?.toString().split('/')[0] || '0');
        
        return sortBy === 'score-asc' ? scoreA - scoreB : scoreB - scoreA;
      }
    } else if (sortBy === 'name-asc' || sortBy === 'name-desc') {
      // Find name column in the data
      const nameColA = Object.keys(a).find(key => key.toLowerCase().includes('name'));
      const nameColB = Object.keys(b).find(key => key.toLowerCase().includes('name'));
      
      if (nameColA && nameColB) {
        const nameA = a[nameColA]?.toString().toLowerCase() || '';
        const nameB = b[nameColB]?.toString().toLowerCase() || '';
        
        return sortBy === 'name-asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      }
    }
    return 0;
  });

  const displayUsers = getDisplayUsers(sortedUsers);
  const displayColumns = displayUsers[0] ? Object.keys(displayUsers[0]) : [];


  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleScoreFilterChange = (e) => {
    setScoreFilter(e.target.value);
  };

  const toggleTooltip = (userIdx, colName) => {
    const key = `${userIdx}-${colName}`;
    setTooltipVisible(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderCellValue = (user, col, userIdx) => {
    if (col.toLowerCase() === 'score') {
      return <span className="score-text">{user[col]}</span>;
    }
    
    if (col.toLowerCase() === 'remarks') {
      const key = `${userIdx}-${col}`;
      const isVisible = tooltipVisible[key];
      const isFlagged = user[col]?.toString().toLowerCase().includes('flagged');
      
      return (
        <div style={{ position: 'relative' }}>
          <div 
            className={`info-icon ${isFlagged ? 'flagged' : ''}`}
            onClick={() => toggleTooltip(userIdx, col)}
          >
            i
            {isVisible && (
              <div className="tooltip show">
                {user[col] || 'No remarks'}
              </div>
            )}
          </div>
        </div>
      );
    }
    
    if (typeof user[col] === 'string' && user[col].startsWith('http')) {
      return (
        <a className="modern-link" href={user[col]} target="_blank" rel="noopener noreferrer">
          <span className="link-label">{user[col].replace(/^https?:\/\//, '').split(/[/?#]/)[0]}</span>
          <span className="link-icon" aria-label="external link">↗</span>
        </a>
      );
    }
    
    return user[col];
  };

  // Removed dark mode toggle

  return (
    <div className="instagram-theme">
      <div className="header-bar">
        <h1 className="main-title">📚 Edumoon Assignment Submissions</h1>
        <div className="header-controls">
          <div className="search-bar-wrapper">
            <input
              className="search-bar"
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="filter-dropdown-wrapper">
            <select
              className="filter-dropdown"
              value={scoreFilter}
              onChange={handleScoreFilterChange}
            >
              <option value="all">All Scores</option>
              <option value="excellent">Excellent (9-10)</option>
              <option value="good">Good (7-8)</option>
              <option value="average">Average (5-6)</option>
              <option value="below-average">Below Average (&lt;5)</option>
              <option value="flagged">🚩 Flagged</option>
            </select>
          </div>
          <div className="sort-dropdown-wrapper">
            <select
              className="sort-dropdown"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="none">Sort by</option>
              <option value="score-desc">Score (High to Low)</option>
              <option value="score-asc">Score (Low to High)</option>
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="card-list-responsive">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="user-card skeleton-card" key={i}>
              <div className="skeleton skeleton-title" />
              {Array.from({ length: 4 }).map((_, j) => (
                <div className="skeleton skeleton-row" key={j} />
              ))}
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="no-results">{error}</div>
      ) : displayUsers.length === 0 ? (
        <div className="no-results">No submissions found for your search.</div>
      ) : (
        <div className="card-list-responsive">
          {displayUsers.map((user, idx) => (
            <div className="user-card" key={idx}>
              <div className="user-card-sno">{user.sno}</div>
              {displayColumns.filter(col => col !== 'sno').map((col, i) => (
                <div key={i}>
                  <div className="user-card-row">
                    <span className="user-card-label">{col.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="user-card-value">
                      {renderCellValue(user, col, idx)}
                    </span>
                  </div>
                  {/* Add divider after college and before score */}
                  {col.toLowerCase().includes('college') && (
                    <div className="section-divider"></div>
                  )}
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
