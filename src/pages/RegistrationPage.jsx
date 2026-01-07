import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StoreRegistrationForm from '../components/StoreRegistrationForm';
import { useTheme } from '../context/ThemeContext';
import { FaArrowLeft, FaStore, FaShieldAlt } from 'react-icons/fa';
import './RegistrationPage.css';

const RegistrationPage = () => {
  const { theme } = useTheme();
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredStore, setRegisteredStore] = useState(null);

  const handleStoreAdded = (newStore) => {
    setRegisteredStore(newStore);
    setRegistrationComplete(true);
  };

  return (
    <div className={`registration-page ${theme}`}>
      <div className="page-header">
        <div className="header-content">
          <Link to="/" className="back-link">
            <FaArrowLeft />
            <span>Back to Directory</span>
          </Link>
          <h1>Register Your Business</h1>
          <p>Join our local directory and reach more customers</p>
        </div>
      </div>

      <div className="page-content">
        <div className="registration-container">
          {registrationComplete ? (
            <div className="success-container">
              <div className="success-icon">
                <FaStore />
              </div>
              <h2>Business Registered Successfully!</h2>
              <p className="success-message">
                Thank you for registering <strong>{registeredStore?.name}</strong>. 
                Your business will be reviewed and appear in our directory within 24-48 hours.
              </p>
              
              <div className="success-actions">
                <Link to="/stores" className="btn-primary">
                  Browse Directory
                </Link>
                <button 
                  onClick={() => {
                    setRegistrationComplete(false);
                    setRegisteredStore(null);
                  }}
                  className="btn-secondary"
                >
                  Register Another Business
                </button>
              </div>

              <div className="info-box">
                <h4><FaShieldAlt /> What's Next?</h4>
                <ul>
                  <li>Our team will review your submission within 24-48 hours</li>
                  <li>You'll receive updates about your listing status</li>
                  <li>You can contact support for any changes</li>
                  <li>Your listing will appear under appropriate categories</li>
                </ul>
              </div>
            </div>
          ) : (
            <StoreRegistrationForm onStoreAdded={handleStoreAdded} />
          )}
        </div>

        <aside className="registration-sidebar">
          <div className="sidebar-card">
            <h3>Why Register?</h3>
            <ul className="benefits-list">
              <li>✅ Free forever listing</li>
              <li>✅ Increased local visibility</li>
              <li>✅ Verified business profile</li>
              <li>✅ Mobile number protection</li>
              <li>✅ Easy updates anytime</li>
              <li>✅ Reach more customers</li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>Registration Limits</h3>
            <div className="limits-info">
              <div className="limit-item">
                <div className="limit-number">2</div>
                <div className="limit-text">Listings per month per mobile</div>
              </div>
              <div className="limit-item">
                <div className="limit-number">24-48</div>
                <div className="limit-text">Hours for approval</div>
              </div>
              <div className="limit-item">
                <div className="limit-number">∞</div>
                <div className="limit-text">Free listings forever</div>
              </div>
            </div>
          </div>

          <div className="sidebar-card">
            <h3>Need Help?</h3>
            <p>Contact our support team for assistance with registration.</p>
            <button className="support-btn">Contact Support</button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RegistrationPage;
