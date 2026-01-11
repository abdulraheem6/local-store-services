// import React from 'react';
// import { 
//   FaMapMarkerAlt, 
//   FaPhone, 
//   FaClock, 
//   FaShoppingBag, 
//   FaTools,
//   FaStar,
//   FaGlobe,
//   FaCheckCircle,
//   FaExternalLinkAlt 
// } from 'react-icons/fa';
// import './StoreCard.css';

// const StoreCard = ({ item, categoryType = 'stores' }) => {
//   const handleGetDirections = () => {
//     const query = encodeURIComponent(`${item.name}, ${item.mandal}, ${item.city}, ${item.state}`);
//     window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
//   };

//   const Icon = categoryType === 'stores' ? FaShoppingBag : FaTools;

//   return (
//     <div className="store-card">
//       <div className="store-header">
//         <div className="store-category">
//           {categoryType === 'stores' ? 'Store' : 'Service'}: {item.category}
//           {item.verified && (
//             <span className="verified-badge">
//               <FaCheckCircle /> Verified
//             </span>
//           )}
//         </div>
//         <div className="store-rating">
//           <FaStar />
//           <span>{item.rating || 4.0}</span>
//         </div>
//       </div>

//       <div className="store-body">
//         <h3 className="store-name">{item.name}</h3>
//         <p className="store-description">{item.description}</p>

//         <div className="store-service">
//           <Icon />
//           <span>{item.serviceType || item.type}</span>
//         </div>

//         <div className="store-details">
//           <div className="detail-item">
//             <FaMapMarkerAlt />
//             <div>
//               <div className="detail-title">Location</div>
//               <div className="detail-value">
//                 {item.mandal}, {item.city}, {item.state}
//               </div>
//             </div>
//           </div>

//           {item.phone && (
//             <div className="detail-item">
//               <FaPhone />
//               <div>
//                 <div className="detail-title">Contact</div>
//                 <div className="detail-value">{item.phone}</div>
//               </div>
//             </div>
//           )}

//           {item.timings && (
//             <div className="detail-item">
//               <FaClock />
//               <div>
//                 <div className="detail-title">Timings</div>
//                 <div className="detail-value">{item.timings}</div>
//               </div>
//             </div>
//           )}
//         </div>

//         {item.tags && item.tags.length > 0 && (
//           <div className="store-tags">
//             {item.tags.map(tag => (
//               <span key={tag} className="tag">{tag}</span>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="store-footer">
//         {item.phone && (
//           <a href={`tel:${item.phone}`} className="contact-btn phone-btn">
//             <FaPhone /> Call Now
//           </a>
//         )}
//         <button onClick={handleGetDirections} className="contact-btn direction-btn">
//           <FaExternalLinkAlt /> Directions
//         </button>
//         {/* Website (if available) */}
//         {item.website && (
//             <div className="detail-item">
//               <FaGlobe />
//               <div>
//                 <span className="detail-title">Website: </span>
//                 <span className="detail-value">
//                   <a href={item.website} target="_blank" rel="noopener noreferrer">
//                     Visit Website
//                   </a>
//                 </span>
//               </div>
//             </div>
//           )}
//       </div>
//     </div>
//   );
// };

// export default StoreCard;

import React from 'react';
import './StoreCard.css';

const StoreCard = ({ item, categoryType, onClick }) => {
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#4caf50';
    if (rating >= 4.0) return '#8bc34a';
    if (rating >= 3.5) return '#ffc107';
    if (rating >= 3.0) return '#ff9800';
    return '#f44336';
  };

  const getCategoryIcon = () => {
    const icons = {
      'restaurant': '🍽️',
      'cafe': '☕',
      'shopping': '🛍️',
      'electronics': '💻',
      'grocery': '🛒',
      'pharmacy': '💊',
      'hospital': '🏥',
      'salon': '💇',
      'gym': '💪',
      'hotel': '🏨',
      'bank': '🏦',
      'book': '📚',
      'car': '🚗',
      'home': '🏠',
      'clothing': '👕'
    };
    
    const category = item.category?.toLowerCase() || item.type?.toLowerCase() || '';
    return icons[category] || (categoryType === 'stores' ? '🏪' : '🔧');
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <div className="store-card" onClick={handleCardClick}>
      <div className="store-card-header">
        <div className="store-image">
          <div className="image-placeholder">
            {getCategoryIcon()}
          </div>
          {item.featured && (
            <span className="featured-badge">FEATURED</span>
          )}
        </div>
        
        <div className="store-basic-info">
          <h3 className="store-name">{item.name}</h3>
          <div className="store-rating">
            <div 
              className="rating-circle"
              style={{ 
                backgroundColor: getRatingColor(item.rating || 4),
                borderColor: getRatingColor(item.rating || 4)
              }}
            >
              <span className="rating-value">{item.rating || 4.0}</span>
              <span className="rating-star">⭐</span>
            </div>
            <span className="rating-count">({item.reviews || 0} reviews)</span>
          </div>
        </div>
      </div>
      
      <div className="store-card-body">
        <div className="store-details">
          <div className="detail-row">
            <span className="detail-label">📍</span>
            <span className="detail-value">{item.location || item.address || 'Location not specified'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">📞</span>
            <span className="detail-value">{item.phone || 'Phone not available'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">⏰</span>
            <span className="detail-value">{item.timings || '9:00 AM - 10:00 PM'}</span>
          </div>
        </div>
        
        <div className="store-tags">
          <span className="store-tag category">{item.category || item.type}</span>
          {item.distance && (
            <span className="store-tag distance">🚗 {item.distance} km</span>
          )}
          {item.price_range && (
            <span className="store-tag price">{'₹'.repeat(item.price_range)}</span>
          )}
          {item.open_now !== false && (
            <span className="store-tag open">🟢 Open Now</span>
          )}
        </div>
      </div>
      
      <div className="store-card-footer">
        <button className="action-btn call-btn" onClick={(e) => {
          e.stopPropagation();
          window.open(`tel:${item.phone || '0000000000'}`, '_blank');
        }}>
          📞 Call
        </button>
        
        <button className="action-btn direction-btn" onClick={(e) => {
          e.stopPropagation();
          window.alert(`Directions to ${item.name}`);
        }}>
          📍 Directions
        </button>
        
        <button className="action-btn details-btn" onClick={(e) => {
          e.stopPropagation();
          handleCardClick();
        }}>
          ℹ️ Details
        </button>
      </div>
    </div>
  );
};

export default StoreCard;
