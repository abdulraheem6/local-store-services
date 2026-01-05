import React, { useState, useEffect } from 'react';
import { FaAd, FaArrowRight } from 'react-icons/fa';
import './AdsSection.css';

const AdsSection = ({ ads }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  useEffect(() => {
    if (ads && ads.length > 1) {
      const interval = setInterval(() => {
        setCurrentAdIndex((prev) => (prev + 1) % ads.length);
      }, 5000); // Rotate ads every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [ads]);

  if (!ads || ads.length === 0) {
    return (
      <div className="ads-section">
        <h3><FaAd /> Advertisements</h3>
        <div className="ad-placeholder">
          <p>Ad space available</p>
          <small>Contact us to advertise here</small>
        </div>
      </div>
    );
  }

  const currentAd = ads[currentAdIndex];

  return (
    <div className="ads-section">
      <h3><FaAd /> Advertisements</h3>
      
      <div className="ad-container">
        <div className="ad-content">
          <h4>{currentAd.title}</h4>
          <p>{currentAd.content}</p>
          {currentAd.link && (
            <a href={currentAd.link} className="ad-link">
              Learn More <FaArrowRight />
            </a>
          )}
        </div>
        
        {ads.length > 1 && (
          <div className="ad-indicators">
            {ads.map((_, index) => (
              <button
                key={index}
                className={`ad-indicator ${index === currentAdIndex ? 'active' : ''}`}
                onClick={() => setCurrentAdIndex(index)}
                aria-label={`Go to ad ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="ads-info">
        <small>Advertisement • Supports our service</small>
      </div>
    </div>
  );
};

export default AdsSection;