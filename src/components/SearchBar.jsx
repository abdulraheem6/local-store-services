import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, onLocationSelect, initialQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationQuery, setLocationQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useState(['Pizza', 'Cafe', 'Gym', 'Salon', 'Electronics']);
  const [popularSearches] = useState(['Restaurants', 'Shopping', 'Delivery', '24x7', 'Near Me']);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery, locationQuery);
      
      // Add to search history
      if (!searchHistory.includes(searchQuery)) {
        setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
      }
    }
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    onSearch(query, locationQuery);
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude}, ${position.coords.longitude}`;
          setLocationQuery('Current Location');
          onLocationSelect({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Current Location'
          });
        },
        () => {
          window.alert('Unable to retrieve your location');
        }
      );
    }
  };

  return (
    <div className={`search-bar-container ${isExpanded ? 'expanded' : ''}`}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <div className="search-field">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for stores, restaurants, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="clear-search"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="location-field">
            <span className="location-icon">📍</span>
            <input
              type="text"
              placeholder="Location, city, or area"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="location-input"
            />
            <button 
              type="button" 
              className="current-location-btn"
              onClick={handleUseCurrentLocation}
              title="Use current location"
            >
              📍
            </button>
          </div>
          
          <button type="submit" className="search-submit">
            Search
          </button>
        </div>

        {isExpanded && (
          <div className="search-suggestions">
            {searchQuery && (
              <div className="suggestions-section">
                <h4>Search Suggestions</h4>
                <div className="suggestions-list">
                  {['restaurant', 'cafe', 'hotel', 'mall', 'hospital']
                    .filter(item => item.includes(searchQuery.toLowerCase()))
                    .map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        className="suggestion-item"
                        onClick={() => handleQuickSearch(item.charAt(0).toUpperCase() + item.slice(1))}
                      >
                        🔍 {item.charAt(0).toUpperCase() + item.slice(1)}
                      </button>
                    ))}
                </div>
              </div>
            )}

            <div className="suggestions-section">
              <h4>Recent Searches</h4>
              <div className="suggestions-list">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    className="suggestion-item history"
                    onClick={() => handleQuickSearch(item)}
                  >
                    <span className="history-icon">🕒</span>
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="suggestions-section">
              <h4>Popular Categories</h4>
              <div className="category-tags">
                {popularSearches.map((category, index) => (
                  <button
                    key={index}
                    type="button"
                    className="category-tag"
                    onClick={() => handleQuickSearch(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="suggestions-section">
              <h4>Quick Filters</h4>
              <div className="quick-filters">
                <button type="button" className="quick-filter">
                  ⭐ 4+ Rating
                </button>
                <button type="button" className="quick-filter">
                  🚗 Under 5km
                </button>
                <button type="button" className="quick-filter">
                  💳 Credit Cards
                </button>
                <button type="button" className="quick-filter">
                  🅿️ Parking
                </button>
                <button type="button" className="quick-filter">
                  ♿ Wheelchair
                </button>
                <button type="button" className="quick-filter">
                  🌙 Open Now
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      <div className="search-tips">
        <span className="tip">💡 Tip: Try "restaurants near me" or "24x7 pharmacy"</span>
      </div>
    </div>
  );
};

export default SearchBar;
