import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaSearch, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover & Connect with <span className="highlight">Local Stores</span>
          </h1>
          <p className="hero-description">
            Find the best local shops, services, and businesses in your area. 
            Register your store and reach more customers today.
          </p>
          <div className="hero-actions">
            <Link to="/stores" className="btn-primary hero-btn">
              <FaSearch />
              <span>Browse Stores</span>
            </Link>
            <Link to="/register" className="btn-secondary hero-btn">
              <FaStore />
              <span>Register Store</span>
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-cards">
            <div className="floating-card card1">
              <FaStore />
              <span>Local Shops</span>
            </div>
            <div className="floating-card card2">
              <FaMapMarkerAlt />
              <span>Near You</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Register With Us?</h2>
          <p>Join thousands of businesses already on our platform</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaSearch />
            </div>
            <h3>Increased Visibility</h3>
            <p>Get discovered by customers searching for local businesses in your area.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaStore />
            </div>
            <h3>Free Listing</h3>
            <p>Register your store for free. No hidden charges or subscription fees.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Local Focus</h3>
            <p>Connect with customers in your neighborhood and surrounding areas.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Grow Your Business?</h2>
          <p>Register your store in just 3 minutes and start reaching more customers today.</p>
          <Link to="/register" className="cta-btn">
            <span>Register Now</span>
            <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Stores Registered</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Cities Covered</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Support Available</p>
          </div>
          <div className="stat-item">
            <h3>Free</h3>
            <p>Forever Free Plan</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
