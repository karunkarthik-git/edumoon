import { DATA } from './utils/source';
import './App.css';
import { Link } from 'react-router-dom';

const INTERNSHIP_LINK = "https://res.cloudinary.com/platform-cloud/image/upload/internship/";
const COMPLETION_LINK = "https://res.cloudinary.com/platform-cloud/image/upload/completion/";

const Cards = ({ item, idx }) => {
    const file_name = item.name.split(' ').join('_') + '.jpg';
    return (
        <div className="user-card" key={idx}>
            <div className="user-card-sno">{idx + 1}</div>
            <div className="user-card-row">
              <span className="user-card-label">Name</span>
              <span className="user-card-value">{item.name}</span>
            </div>
            <div className="user-card-row">
              <span className="user-card-label">Email</span>
              <span className="user-card-value">{item.email}</span>
            </div>
            <div className="user-card-row">
              <span className="user-card-label">Internship</span>
              <a
                href={`${INTERNSHIP_LINK}${file_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="user-card-value certificate-link"
              >
                View
              </a>
            </div>
            {item.status != 'NOT_SUBMITTED' && <div className="user-card-row">
              <span className="user-card-label">Course Completion</span>
              <a
                href={`${COMPLETION_LINK}${file_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="user-card-value certificate-link"
              >
                View
              </a>
            </div>}
        </div>
    )
}


import { useState } from 'react';

const Certificates = () => {
  const [search, setSearch] = useState('');
  const filteredData = DATA.filter(item => item.email.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="instagram-theme">
      <div className="header-bar">
        <h1 className="main-title">🎓 EduMoon Certificates</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '60%', justifyContent: 'flex-end' }}>
          <Link to="/" className="certificates-link">
            <span className="certificates-text">Back to Results</span>
          </Link>
          <input
            className="search-bar"
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 268 }}
          />
        </div>
      </div>
      <div className="card-list-responsive">
        {filteredData.map((item, idx) => (
          <Cards item={item} idx={idx} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default Certificates;
