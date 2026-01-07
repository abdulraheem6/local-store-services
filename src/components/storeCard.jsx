import React from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaClock, 
  FaShoppingBag, 
  FaTools,
  FaStar,
  FaGlobe,
  FaCheckCircle,
  FaExternalLinkAlt 
} from 'react-icons/fa';
import './StoreCard.css';

const StoreCard = ({ item, categoryType = 'stores' }) => {
  const handleGetDirections = () => {
    const query = encodeURIComponent(`${item.name}, ${item.mandal}, ${item.city}, ${item.state}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const Icon = categoryType === 'stores' ? FaShoppingBag : FaTools;

  return (
    <div className="store-card">
      <div className="store-header">
        <div className="store-category">
          {categoryType === 'stores' ? 'Store' : 'Service'}: {item.category}
          {item.verified && (
            <span className="verified-badge">
              <FaCheckCircle /> Verified
            </span>
          )}
        </div>
        <div className="store-rating">
          <FaStar />
          <span>{item.rating || 4.0}</span>
        </div>
      </div>

      <div className="store-body">
        <h3 className="store-name">{item.name}</h3>
        <p className="store-description">{item.description}</p>

        <div className="store-service">
          <Icon />
          <span>{item.serviceType || item.type}</span>
        </div>

        <div className="store-details">
          <div className="detail-item">
            <FaMapMarkerAlt />
            <div>
              <div className="detail-title">Location</div>
              <div className="detail-value">
                {item.mandal}, {item.city}, {item.state}
              </div>
            </div>
          </div>

          {item.phone && (
            <div className="detail-item">
              <FaPhone />
              <div>
                <div className="detail-title">Contact</div>
                <div className="detail-value">{item.phone}</div>
              </div>
            </div>
          )}

          {item.timings && (
            <div className="detail-item">
              <FaClock />
              <div>
                <div className="detail-title">Timings</div>
                <div className="detail-value">{item.timings}</div>
              </div>
            </div>
          )}
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="store-tags">
            {item.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className="store-footer">
        {item.phone && (
          <a href={`tel:${item.phone}`} className="contact-btn phone-btn">
            <FaPhone /> Call Now
          </a>
        )}
        <button onClick={handleGetDirections} className="contact-btn direction-btn">
          <FaExternalLinkAlt /> Directions
        </button>
        {/* Website (if available) */}
        {item.website && (
            <div className="detail-item">
              <FaGlobe />
              <div>
                <div className="detail-title">Website</div>
                <div className="detail-value">
                  <a href={item.website} target="_blank" rel="noopener noreferrer">
                    Visit Website
                  </a>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default StoreCard;
