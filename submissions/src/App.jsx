
import { useEffect, useState } from 'react';
import './App.css';
import { fetchSheetData } from './utils/fetchSheetData';
import { Link } from 'react-router-dom';



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
    
    // Check for flagged filter based on S1-S4 being 0
    const sKeys = ['S1', 'S2', 'S3', 'S4'];
    const isFlagged = sKeys.some(sk => (u[sk] !== undefined && String(u[sk]).trim() === '0'));
    // Always show flagged users in their score bracket as well
    if (scoreFilter === 'flagged') {
      return isFlagged;
    }
    // Find score column in the data
    const scoreCol = Object.keys(u).find(key => key.toLowerCase().includes('score'));
    if (!scoreCol) return true;
    const score = parseFloat(u[scoreCol] || '0');
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
        const scoreA = parseFloat(a[scoreColA] || '0');
        const scoreB = parseFloat(b[scoreColB] || '0');
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

  // Render cell value (revert to candidate info + links as before)
  const renderCellValue = (user, col, userIdx) => {
    if (col.toLowerCase() === 'score') {
      return <span className="score-text">{user[col]}</span>;
    }
    if (col.toLowerCase() === 'remarks') {
      const key = `${userIdx}-${col}`;
      const isVisible = tooltipVisible[key];
      const sKeys = ['S1', 'S2', 'S3', 'S4'];
      const isFlagged = sKeys.some(sk => (user[sk] !== undefined && String(user[sk]).trim() === '0'));
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
        <h1 className="main-title">📚 Edumoon</h1>
        <div className="header-controls">
          <Link to="/certificates" className="certificates-link">
            <span className="certificates-text">Certificates</span>
          </Link>
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
              {displayColumns.filter(col => col !== 'sno').map((col, i) => {
                // Prevent generic rendering of assignment links and scores
                if (["s1", "s2", "s3", "s4", "a1", "a2", "a3", "a4"].includes(col.toLowerCase())) {
                  return null;
                }
                // Render all fields up to and including College as before
                const isCollege = col.toLowerCase().includes('college');
                if (!isCollege) {
                  return (
                    <div key={i}>
                      <div className="user-card-row">
                        <span className="user-card-label">{col.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="user-card-value">
                          {renderCellValue(user, col, idx)}
                        </span>
                      </div>
                      {/* Add divider after college and before score */}
                    </div>
                  );
                } else {
                  // After college, render the divider and then the assignment table
                  // Find assignment names, scores, and links
                  const aNames = ['A1', 'A2', 'A3', 'A4'];
                  const aScores = [user['S1'], user['S2'], user['S3'], user['S4']];
                  const aLinks = [user['A1'], user['A2'], user['A3'], user['A4']];
                  return (
                    <div key={i}>
                      <div className="user-card-row">
                        <span className="user-card-label">{col.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="user-card-value">
                          {renderCellValue(user, col, idx)}
                        </span>
                      </div>
                      <div className="section-divider"></div>
                      {/* Assignment rows, styled like other card rows */}
                      {[0,1,2,3].map(j => (
                        <div className="user-card-row assignment-row-clean" key={j}>
                          <span className="user-card-label assignment-label">{aNames[j]}</span>
                          <span className="user-card-value assignment-value">
                            {aLinks[j] && typeof aLinks[j] === 'string' && aLinks[j].startsWith('http') ? (
                              <>
                                <a className="modern-link" href={aLinks[j]} target="_blank" rel="noopener noreferrer">
                                  {aLinks[j].replace(/^https?:\/\//, '').split(/[/?#]/)[0]}
                                  <span className="link-icon" aria-label="external link">↗</span>
                                </a>
                                <span className="assignment-score-inline">{aScores[j] ? ` (${aScores[j]})` : ''}</span>
                              </>
                            ) : (
                              <>
                                {aLinks[j] || '-'}
                                <span className="assignment-score-inline">{aScores[j] ? ` (${aScores[j]})` : ''}</span>
                              </>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
