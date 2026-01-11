import React, { useState, useEffect, useRef } from 'react';
import './MapView.css';

const MapView = ({ items, center, userLocation, onItemSelect, selectedItem }) => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [zoom, setZoom] = useState(12);

  // Simulate Google Maps API with a simple implementation
  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map (simplified version - in real app, use Google Maps or Mapbox)
    const initMap = () => {
      // Create a simple div-based map
      const mapElement = mapRef.current;
      mapElement.innerHTML = '<div class="map-background"></div>';
      
      // Add markers
      const newMarkers = items.map((item, index) => {
        const marker = document.createElement('div');
        marker.className = `map-marker ${selectedItem?.id === item.id ? 'selected' : ''}`;
        marker.innerHTML = `
          <div class="marker-icon">${getMarkerIcon(item.category || item.type)}</div>
          <div class="marker-label">${item.name}</div>
        `;
        
        // Position marker randomly (simulated)
        const left = 50 + (Math.random() - 0.5) * 40;
        const top = 50 + (Math.random() - 0.5) * 40;
        
        marker.style.left = `${left}%`;
        marker.style.top = `${top}%`;
        
        marker.onclick = () => onItemSelect(item);
        
        mapElement.appendChild(marker);
        return marker;
      });
      
      // Add user location marker
      if (userLocation) {
        const userMarker = document.createElement('div');
        userMarker.className = 'user-marker';
        userMarker.innerHTML = '<div class="user-marker-icon">📍</div>';
        userMarker.style.left = '50%';
        userMarker.style.top = '50%';
        mapElement.appendChild(userMarker);
      }
      
      setMarkers(newMarkers);
    };

    initMap();
  }, [items, userLocation, selectedItem]);

  const getMarkerIcon = (category) => {
    const icons = {
      'restaurant': '🍽️',
      'cafe': '☕',
      'shopping': '🛍️',
      'electronics': '💻',
      'grocery': '🛒',
      'repair': '🔧',
      'beauty': '💄',
      'medical': '🏥',
      'default': '📍'
    };
    
    return icons[category?.toLowerCase()] || icons.default;
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 18));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 8));

  return (
    <div className="map-container">
      <div className="map-controls">
        <button className="map-control-btn" onClick={handleZoomIn}>+</button>
        <button className="map-control-btn" onClick={handleZoomOut}>-</button>
        <button 
          className="map-control-btn"
          onClick={() => userLocation && onItemSelect(null)}
        >
          🗺️
        </button>
        <button 
          className="map-control-btn"
          onClick={() => window.alert('Satellite view coming soon!')}
        >
          🛰️
        </button>
      </div>
      
      <div ref={mapRef} className="map-area">
        <div className="map-info">
          <p>📍 Showing {items.length} businesses in this area</p>
          <small>Zoom: {zoom}x • Click markers for details</small>
        </div>
      </div>
      
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-icon user">📍</span>
          <span>Your Location</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon store">🏪</span>
          <span>Stores</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon service">🔧</span>
          <span>Services</span>
        </div>
        <div className="legend-item">
          <span className="legend-icon selected">⭐</span>
          <span>Selected</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
