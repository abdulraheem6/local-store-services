import React from 'react';
import { FaInfoCircle, FaStore, FaFilter, FaSearch, FaHandshake } from 'react-icons/fa';
import './AboutSection.css';

const AboutSection = ({ aboutData }) => {
  return (
    <div className="about-section">
      <div className="about-header">
        <FaInfoCircle />
        <h2>Welcome to Local Stores Directory</h2>
      </div>
      
      <div className="about-content">
        <p className="about-description">
          {aboutData?.description || "Find and explore local stores and services in your area with our comprehensive directory."}
        </p>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <FaStore />
            </div>
            <h3>Discover Local Stores</h3>
            <p>Find businesses in your neighborhood across multiple categories</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaFilter />
            </div>
            <h3>Smart Filtering</h3>
            <p>Filter by state, city, mandal, category, and service type</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaSearch />
            </div>
            <h3>Precise Search</h3>
            <p>Search with specific criteria to find exactly what you need</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaHandshake />
            </div>
            <h3>Support Local</h3>
            <p>Help local businesses grow by discovering and using their services</p>
          </div>
        </div>
        
        <div className="how-to-use">
          <h3>How to Use:</h3>
          <ol>
            <li>Select your <strong>State</strong> from the dropdown</li>
            <li>Choose your <strong>City</strong> (available after selecting state)</li>
            <li>Select your <strong>Mandal/Taluk</strong> (available after selecting city)</li>
            <li>Pick a <strong>Category</strong> (Grocery, Electronics, Medical, etc.)</li>
            <li>Select <strong>Service Type</strong> (Retail, Service, Repair, etc.)</li>
            <li>Click <strong>"Search Stores"</strong> to find results</li>
          </ol>
        </div>
        
        {aboutData?.features && (
          <div className="additional-features">
            <h3>Features:</h3>
            <ul>
              {aboutData.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="about-footer">
        <p>
          Need help? {aboutData?.contact && (
            <>Contact us at <strong>{aboutData.contact}</strong></>
          )}
        </p>
      </div>
    </div>
  );
};

export default AboutSection;