import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaStore, 
  FaSearch, 
  FaMapMarkerAlt, 
  FaArrowRight, 
  FaUsers, 
  FaShieldAlt, 
  FaRocket, 
  FaChartLine,
  FaBars,
  FaTimes,
  FaExternalLinkAlt,
  FaStar,
  FaCrown,
  FaAd,
  FaBullhorn,
  FaCheckCircle
} from 'react-icons/fa';
import { GiGrowth, GiShoppingBag } from 'react-icons/gi';
import { MdLocalOffer, MdTrendingUp } from 'react-icons/md';
import './HomePage.css';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="home-page">
      {/* Modern Navbar */}
      <nav className="modern-navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/" className="brand-logo">
              <FaStore className="logo-icon" />
              <span className="brand-name">Local<span className="brand-highlight">Connect</span></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="nav-links">
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/stores" className="nav-link">Browse Stores</Link>
            <Link to="/register" className="nav-link">Register Store</Link>
            <Link to="/features" className="nav-link">Features</Link>
            
            {/* Dropdown for Other Services */}
            <div className="nav-dropdown">
              <button className="dropdown-toggle">
                <span>Our Services</span>
                <FaArrowRight className="dropdown-arrow" />
              </button>
              <div className="dropdown-menu">
                <a href="https://example-ecommerce.com" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                  <GiShoppingBag />
                  <span>E-Commerce Store</span>
                  <FaExternalLinkAlt className="external-icon" />
                </a>
                <a href="https://example-food.com" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                  <FaStore />
                  <span>Food Delivery</span>
                  <FaExternalLinkAlt className="external-icon" />
                </a>
                <a href="https://example-job.com" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                  <FaUsers />
                  <span>Job Portal</span>
                  <FaExternalLinkAlt className="external-icon" />
                </a>
                <a href="https://example-realestate.com" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                  <FaMapMarkerAlt />
                  <span>Real Estate</span>
                  <FaExternalLinkAlt className="external-icon" />
                </a>
                          {/* Sports Service */}
                <a href="https://example-sports.com" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                  <FaFutbol />
                  <span>Sports Academy</span>
                  <FaExternalLinkAlt className="external-icon" />
                </a>
                {/* Education Service */}
                <a href="https://example-education.com" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                  <FaGraduationCap />
                  <span>Education Portal</span>
                  <FaExternalLinkAlt className="external-icon" />
                </a>
              </div>
            </div>
          </div>

          <div className="nav-actions">
            <Link to="/login" className="nav-btn login-btn">Login</Link>
            <Link to="/register" className="nav-btn register-btn">Get Started</Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="mobile-nav">
            <Link to="/" className="mobile-nav-link active" onClick={toggleMenu}>Home</Link>
            <Link to="/stores" className="mobile-nav-link" onClick={toggleMenu}>Browse Stores</Link>
            <Link to="/register" className="mobile-nav-link" onClick={toggleMenu}>Register Store</Link>
            <Link to="/features" className="mobile-nav-link" onClick={toggleMenu}>Features</Link>
            
            <div className="mobile-services-section">
              <h4 className="services-title">Our Other Services</h4>
              <a href="https://example-ecommerce.com" target="_blank" rel="noopener noreferrer" className="mobile-service-link">
                <GiShoppingBag />
                <span>E-Commerce Store</span>
                <FaExternalLinkAlt />
              </a>
              <a href="https://example-food.com" target="_blank" rel="noopener noreferrer" className="mobile-service-link">
                <FaStore />
                <span>Food Delivery</span>
                <FaExternalLinkAlt />
              </a>
              <a href="https://example-job.com" target="_blank" rel="noopener noreferrer" className="mobile-service-link">
                <FaUsers />
                <span>Job Portal</span>
                <FaExternalLinkAlt />
              </a>
              <a href="https://example-realestate.com" target="_blank" rel="noopener noreferrer" className="mobile-service-link">
                <FaMapMarkerAlt />
                <span>Real Estate</span>
                <FaExternalLinkAlt />
              </a>
               {/* Sports Service - Mobile */}
              <a href="https://example-sports.com" target="_blank" rel="noopener noreferrer" className="mobile-service-link">
                <FaFutbol />
                <span>Sports Academy</span>
                <FaExternalLinkAlt />
              </a>
              {/* Education Service - Mobile */}
              <a href="https://example-education.com" target="_blank" rel="noopener noreferrer" className="mobile-service-link">
                <FaGraduationCap />
                <span>Education Portal</span>
                <FaExternalLinkAlt />
              </a>
            </div>

            <div className="mobile-actions">
              <Link to="/login" className="mobile-login-btn" onClick={toggleMenu}>Login</Link>
              <Link to="/register" className="mobile-register-btn" onClick={toggleMenu}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <span>🚀 Trusted by 500+ Local Stores</span>
            </div>
            <h1 className="hero-title">
              Discover & Connect with <span className="highlight">Local Stores</span> in Your Area
            </h1>
            <p className="hero-description">
              Find the best local shops, services, and businesses around you. 
              Register your store for free and reach more customers today.
            </p>
            <div className="hero-actions">
              <Link to="/stores" className="btn-primary hero-btn">
                <FaSearch className="btn-icon" />
                <span>Browse Stores</span>
                <FaArrowRight className="btn-arrow" />
              </Link>
              <Link to="/register" className="btn-secondary hero-btn">
                <FaStore className="btn-icon" />
                <span>Register Store</span>
                <FaArrowRight className="btn-arrow" />
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-chip">
                <span className="stat-number">500+</span>
                <span className="stat-label">Stores</span>
              </div>
              <div className="stat-chip">
                <span className="stat-number">50+</span>
                <span className="stat-label">Cities</span>
              </div>
              <div className="stat-chip">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-elements">
              <div className="floating-element element-store">
                <div className="element-icon">
                  <FaStore />
                </div>
                <div className="element-content">
                  <h4>Local Shops</h4>
                  <p>Discover nearby</p>
                </div>
              </div>
              <div className="floating-element element-map">
                <div className="element-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="element-content">
                  <h4>Near You</h4>
                  <p>Find local gems</p>
                </div>
              </div>
              <div className="floating-element element-growth">
                <div className="element-icon">
                  <GiGrowth />
                </div>
                <div className="element-content">
                  <h4>Grow Faster</h4>
                  <p>Reach customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Section */}
      <section className="advertisement-section">
        <div className="section-container">
          <div className="ad-header">
            <div className="ad-badge">
              <FaBullhorn />
              <span>Premium Advertisement</span>
            </div>
            <h2>Get More Customers with Our Premium Ads</h2>
            <p>Stand out from the competition and reach more customers with our targeted advertising solutions</p>
          </div>
          
          <div className="ad-grid">
            <div className="ad-card featured">
              <div className="ad-badge featured-badge">
                <FaCrown />
                <span>Most Popular</span>
              </div>
              <div className="ad-card-header">
                <div className="ad-icon">
                  <FaStar />
                </div>
                <div className="ad-plan">
                  <h3>Premium Spotlight</h3>
                  <p className="ad-price">$49<span>/month</span></p>
                </div>
              </div>
              <div className="ad-features">
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Top of search results</span>
                </div>
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Featured store badge</span>
                </div>
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Homepage spotlight</span>
                </div>
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Priority support</span>
                </div>
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Analytics dashboard</span>
                </div>
              </div>
              <button className="ad-cta-btn">Get Premium</button>
              <p className="ad-note">30-day money back guarantee</p>
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <div className="ad-icon">
                  <MdTrendingUp />
                </div>
                <div className="ad-plan">
                  <h3>Featured Listing</h3>
                  <p className="ad-price">$29<span>/month</span></p>
                </div>
              </div>
              <div className="ad-features">
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Higher in search results</span>
                </div>
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Featured section placement</span>
                </div>
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Enhanced store profile</span>
                </div>
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Weekly performance report</span>
                </div>
              </div>
              <button className="ad-cta-btn secondary">Get Featured</button>
            </div>

            <div className="ad-card">
              <div className="ad-card-header">
                <div className="ad-icon">
                  <MdLocalOffer />
                </div>
                <div className="ad-plan">
                  <h3>Promoted Deals</h3>
                  <p className="ad-price">$19<span>/month</span></p>
                </div>
              </div>
              <div className="ad-features">
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Promoted offers & deals</span>
                </div>
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Email newsletter feature</span>
                </div>
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Social media promotion</span>
                </div>
                <div className="ad-feature">
                  <FaCheckCircle className="feature-check" />
                  <span>Basic analytics</span>
                </div>
              </div>
              <button className="ad-cta-btn secondary">Promote Deals</button>
            </div>
          </div>

          <div className="ad-testimonials">
            <div className="ad-testimonial">
              <p>"Premium ads increased our store visits by 300% in just one month!"</p>
              <div className="testimonial-author">
                <img src="https://i.pravatar.cc/40?img=1" alt="User" className="author-avatar" />
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <p>Boutique Owner</p>
                </div>
              </div>
            </div>
            <div className="ad-testimonial">
              <p>"Best advertising ROI we've ever had. The featured listing works wonders!"</p>
              <div className="testimonial-author">
                <img src="https://i.pravatar.cc/40?img=2" alt="User" className="author-avatar" />
                <div className="author-info">
                  <h4>Mike Rodriguez</h4>
                  <p>Coffee Shop Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">
              <span>Why Choose Us</span>
            </div>
            <h2>Everything You Need to Grow Your Local Business</h2>
            <p>Join thousands of businesses already thriving on our platform</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon">
                  <FaSearch />
                </div>
                <div className="feature-number">01</div>
              </div>
              <h3>Increased Visibility</h3>
              <p>Get discovered by customers searching for local businesses in your area with our advanced search algorithms.</p>
              <div className="feature-link">
                <Link to="/how-it-works">Learn more</Link>
                <FaArrowRight />
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon">
                  <FaChartLine />
                </div>
                <div className="feature-number">02</div>
              </div>
              <h3>Free Forever</h3>
              <p>Register your store completely free. No hidden charges, subscription fees, or commission on sales.</p>
              <div className="feature-link">
                <Link to="/pricing">See pricing</Link>
                <FaArrowRight />
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon">
                  <FaUsers />
                </div>
                <div className="feature-number">03</div>
              </div>
              <h3>Local Community</h3>
              <p>Connect with customers in your neighborhood and build lasting relationships with your local community.</p>
              <div className="feature-link">
                <Link to="/community">Join community</Link>
                <FaArrowRight />
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-container">
                <div className="feature-icon">
                  <FaShieldAlt />
                </div>
                <div className="feature-number">04</div>
              </div>
              <h3>Verified Stores</h3>
              <p>Get verified badge to build trust and stand out from the competition. Customers prefer verified stores.</p>
              <div className="feature-link">
                <Link to="/verification">Get verified</Link>
                <FaArrowRight />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-content">
            <div className="stats-text">
              <h2>Join Our Growing Community of Local Businesses</h2>
              <p>We're helping local stores reach more customers every day</p>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaStore />
                </div>
                <div className="stat-info">
                  <h3>500+</h3>
                  <p>Active Stores</p>
                </div>
                <div className="stat-trend">↑ 15% this month</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="stat-info">
                  <h3>50+</h3>
                  <p>Cities Covered</p>
                </div>
                <div className="stat-trend">↑ 8 new cities</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-info">
                  <h3>10K+</h3>
                  <p>Monthly Visitors</p>
                </div>
                <div className="stat-trend">↑ 25% growth</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaRocket />
                </div>
                <div className="stat-info">
                  <h3>100%</h3>
                  <p>Free Forever</p>
                </div>
                <div className="stat-trend">No hidden fees</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <div className="cta-badge">
              <span>Limited Time Offer</span>
            </div>
            <h2>Ready to Grow Your Local Business?</h2>
            <p>Register your store in just 3 minutes and start reaching more customers in your area today.</p>
            <div className="cta-features">
              <div className="cta-feature">
                <div className="cta-feature-icon">✓</div>
                <span>Free forever</span>
              </div>
              <div className="cta-feature">
                <div className="cta-feature-icon">✓</div>
                <span>No credit card required</span>
              </div>
              <div className="cta-feature">
                <div className="cta-feature-icon">✓</div>
                <span>Get verified badge</span>
              </div>
            </div>
            <div className="cta-actions">
              <Link to="/register" className="cta-btn-primary">
                <FaStore />
                <span>Register Store Now</span>
                <FaArrowRight />
              </Link>
              <Link to="/demo" className="cta-btn-secondary">
                <FaSearch />
                <span>Watch Demo</span>
              </Link>
            </div>
            <div className="cta-note">
              <FaShieldAlt />
              <span>Trusted by local businesses. No spam, ever.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
