// import React from 'react';
// import { Link } from 'react-router-dom';
// import { FaStore, FaSearch, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
// import './HomePage.css';

// const HomePage = () => {
//   return (
//     <div className="home-page">
//       {/* Hero Section */}
//       <section className="hero-section">
//         <div className="hero-content">
//           <h1 className="hero-title">
//             Discover & Connect with <span className="highlight">Local Stores/Services</span>
//           </h1>
//           <p className="hero-description">
//             Find the best local shops, services, and businesses in your area. 
//             Register your store and reach more customers today.
//           </p>
//           <div className="hero-actions">
//             <Link to="/stores" className="btn-primary hero-btn">
//               <FaSearch />
//               <span>Browse Stores</span>
//             </Link>
//             <Link to="/register" className="btn-secondary hero-btn">
//               <FaStore />
//               <span>Register Business</span>
//             </Link>
//           </div>
//         </div>
//         <div className="hero-image">
//           <div className="floating-cards">
//             <div className="floating-card card1">
//               <FaStore />
//               <span>Local Shops/Services</span>
//             </div>
//             <div className="floating-card card2">
//               <FaMapMarkerAlt />
//               <span>Near You</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="features-section">
//         <div className="section-header">
//           <h2>Why Register With Us?</h2>
//           <p>Join thousands of businesses already on our platform</p>
//         </div>
//         <div className="features-grid">
//           <div className="feature-card">
//             <div className="feature-icon">
//               <FaSearch />
//             </div>
//             <h3>Increased Visibility</h3>
//             <p>Get discovered by customers searching for local businesses in your area.</p>
//           </div>
//           <div className="feature-card">
//             <div className="feature-icon">
//               <FaStore />
//             </div>
//             <h3>Free Listing</h3>
//             <p>Register your store/service for free. No hidden charges or subscription fees.</p>
//           </div>
//           <div className="feature-card">
//             <div className="feature-icon">
//               <FaMapMarkerAlt />
//             </div>
//             <h3>Local Focus</h3>
//             <p>Connect with customers in your neighborhood and surrounding areas.</p>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="cta-section">
//         <div className="cta-content">
//           <h2>Ready to Grow Your Business?</h2>
//           <p>Register your store/service in just 3 minutes and start reaching more customers today.</p>
//           <Link to="/register" className="cta-btn">
//             <span>Register Now</span>
//             <FaArrowRight />
//           </Link>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="stats-section">
//         <div className="stats-grid">
//           <div className="stat-item">
//             <h3>500+</h3>
//             <p>Stores Registered</p>
//           </div>
//           <div className="stat-item">
//             <h3>50+</h3>
//             <p>Cities Covered</p>
//           </div>
//           <div className="stat-item">
//             <h3>24/7</h3>
//             <p>Support Available</p>
//           </div>
//           <div className="stat-item">
//             <h3>Free</h3>
//             <p>Forever Free Plan for One business</p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaSearch, FaMapMarkerAlt, FaArrowRight, FaUsers, FaShieldAlt, FaRocket, FaChartLine } from 'react-icons/fa';
import { GiGrowth } from 'react-icons/gi';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
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

      {/* Testimonials Section (Optional - Add if you have reviews) */}
      <section className="testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-badge">
              <span>Success Stories</span>
            </div>
            <h2>What Local Store Owners Say</h2>
            <p>Real stories from businesses that grew with us</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Since registering, my store visibility increased by 300%! The free listing is amazing."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Sarah Chen</h4>
                  <p>Local Bakery Owner</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The local focus helped me connect with my neighborhood customers. Highly recommend!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-info">
                  <h4>Mike Rodriguez</h4>
                  <p>Hardware Store</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
