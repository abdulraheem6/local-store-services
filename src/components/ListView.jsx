import React from 'react';
import StoreCard from './StoreCard';
import './ListView.css';

const ListView = ({ items, categoryType, onItemSelect, sortBy }) => {
  const getSortLabel = () => {
    switch(sortBy) {
      case 'rating': return 'Top Rated';
      case 'distance': return 'Nearest';
      case 'name': return 'Alphabetical';
      default: return 'Relevant';
    }
  };

  const getItemFeatures = (item) => {
    const features = [];
    
    if (item.rating >= 4.5) features.push('⭐ Top Rated');
    if (item.distance && parseFloat(item.distance) < 2) features.push('📍 Nearby');
    if (item.featured) features.push('🔥 Featured');
    if (item.delivery) features.push('🚚 Delivery');
    if (item.booking) features.push('📅 Booking Available');
    
    return features;
  };

  return (
    <div className="list-view">
      <div className="list-header">
        <div className="list-summary">
          <h3>{getSortLabel()} Results</h3>
          <div className="list-stats">
            <span className="stat-item">
              <span className="stat-icon">⭐</span>
              <span>Average Rating: {items.length > 0 ? 
                (items.reduce((sum, item) => sum + parseFloat(item.rating || 4), 0) / items.length).toFixed(1) : 
                '4.5'}
              </span>
            </span>
            <span className="stat-item">
              <span className="stat-icon">🚗</span>
              <span>Avg Distance: {items.length > 0 ? 
                (items.reduce((sum, item) => sum + parseFloat(item.distance || 5), 0) / items.length).toFixed(1) : 
                '2.5'} km
              </span>
            </span>
          </div>
        </div>
        
        <div className="view-options">
          <div className="view-density">
            <span>View:</span>
            <button className="density-btn active">Compact</button>
            <button className="density-btn">Detailed</button>
          </div>
        </div>
      </div>
      
      <div className="items-list">
        {items.map((item, index) => (
          <div 
            key={item.id || `item-${index}`} 
            className="list-item-card"
            onClick={() => onItemSelect(item)}
          >
            <div className="item-rank">
              <span className="rank-number">#{index + 1}</span>
            </div>
            
            <div className="item-image">
              <div className="image-placeholder">
                {item.category === 'Restaurant' ? '🍽️' : 
                 item.category === 'Shopping' ? '🛍️' : 
                 item.category === 'Services' ? '🔧' : '🏪'}
              </div>
              {item.featured && (
                <span className="featured-badge">FEATURED</span>
              )}
            </div>
            
            <div className="item-details">
              <div className="item-header">
                <h4 className="item-name">{item.name}</h4>
                <div className="item-rating">
                  <span className="rating-badge">⭐ {item.rating}</span>
                  <span className="rating-count">({item.reviews} reviews)</span>
                </div>
              </div>
              
              <div className="item-category">
                <span className="category-tag">{item.category || item.type}</span>
                <span className="item-distance">🚗 {item.distance} km</span>
              </div>
              
              <p className="item-description">
                {item.description || item.address || `${item.category} in ${item.location}`}
              </p>
              
              <div className="item-features">
                {getItemFeatures(item).slice(0, 3).map((feature, idx) => (
                  <span key={idx} className="feature-tag">{feature}</span>
                ))}
              </div>
              
              <div className="item-footer">
                <div className="item-actions">
                  <button className="action-btn small" onClick={(e) => {
                    e.stopPropagation();
                    window.open(`tel:${item.phone || '0000000000'}`, '_blank');
                  }}>
                    📞 Call
                  </button>
                  <button className="action-btn small" onClick={(e) => {
                    e.stopPropagation();
                    window.alert(`Directions to ${item.name}`);
                  }}>
                    📍 Directions
                  </button>
                  <button className="action-btn small" onClick={(e) => {
                    e.stopPropagation();
                    onItemSelect(item);
                  }}>
                    ℹ️ Details
                  </button>
                </div>
                
                <div className="item-status">
                  {item.open_now !== false ? (
                    <span className="status-open">🟢 Open Now</span>
                  ) : (
                    <span className="status-closed">🔴 Closed</span>
                  )}
                  {item.price_range && (
                    <span className="price-indicator">
                      {'₹'.repeat(item.price_range)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="item-bookmark">
              <button 
                className="bookmark-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  window.alert(`Saved ${item.name} to bookmarks!`);
                }}
              >
                ❤️
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="empty-list">
          <div className="empty-icon">🏪</div>
          <h3>No businesses found</h3>
          <p>Try adjusting your filters or search criteria</p>
        </div>
      )}
    </div>
  );
};

export default ListView;
