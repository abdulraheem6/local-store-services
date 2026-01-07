import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaHome, FaSearch, FaUserPlus } from 'react-icons/fa';
import './Navigation.css';

const Navigation = ({ theme, currentPath }) => {
  return (
    <nav className={`main-navigation ${theme}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <FaStore className="brand-icon" />
          <Link to="/" className="brand-name">Local Directory</Link>
        </div>

        <ul className="nav-menu">
          <li className={`nav-item ${currentPath === '/' ? 'active' : ''}`}>
            <Link to="/" className="nav-link">
              <FaHome className="nav-icon" />
              <span className="nav-text">Home</span>
            </Link>
          </li>
          
          <li className={`nav-item ${currentPath === '/stores' ? 'active' : ''}`}>
            <Link to="/stores" className="nav-link">
              <FaSearch className="nav-icon" />
              <span className="nav-text">Browse Directory</span>
            </Link>
          </li>
          
          <li className={`nav-item ${currentPath === '/register' ? 'active' : ''}`}>
            <Link to="/register" className="nav-link register-nav-btn">
              <FaUserPlus className="nav-icon" />
              <span className="nav-text">Register Business</span>
            </Link>
          </li>
        </ul>

        <div className="nav-actions">
          <Link to="/register" className="register-cta-btn">
            <FaStore />
            <span>Add Your Business</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
