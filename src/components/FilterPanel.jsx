import React from 'react';
import { FaFilter, FaSearch, FaTimes, FaMapMarkerAlt, FaTag, FaStore } from 'react-icons/fa';
import './FilterPanel.css';

const FilterPanel = ({ 
  filters, 
  locations,
  categories,
  typeOptions,
  categoryType,
  onFilterChange,
  onClearFilters,
  onSearch,
  isSearchEnabled
}) => {
  const allFiltersSelected = Object.values(filters).every(value => value !== '');
  const categoryOptions = Object.keys(categories || {});

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <div className="filter-title">
          <FaFilter />
          <h3>Find {categoryType === 'stores' ? 'Stores' : 'Services'}</h3>
        </div>
        <span className="filter-instruction">
          Select all 5 filters to enable search
        </span>
      </div>

      <div className="hierarchy-path">
        <div className={`hierarchy-step ${filters.state ? 'active' : ''}`}>
          <FaMapMarkerAlt />
          <span>State</span>
        </div>
        <div className={`hierarchy-step ${filters.city ? 'active' : ''}`}>
          <FaMapMarkerAlt />
          <span>City</span>
        </div>
        <div className={`hierarchy-step ${filters.mandal ? 'active' : ''}`}>
          <FaMapMarkerAlt />
          <span>Mandal</span>
        </div>
        <div className={`hierarchy-step ${filters.category ? 'active' : ''}`}>
          <FaTag />
          <span>Category</span>
        </div>
        <div className={`hierarchy-step ${filters.type ? 'active' : ''}`}>
          <FaStore />
          <span>Type</span>
        </div>
      </div>

      <div className="filters-grid">
        {/* State Filter */}
        <div className="filter-group">
          <label htmlFor="state">State *</label>
          <div className="select-wrapper">
            <select
              id="state"
              value={filters.state}
              onChange={(e) => onFilterChange('state', e.target.value)}
              className="filter-select"
            >
              <option value="">Select State</option>
              {locations.states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        {/* City Filter */}
        <div className="filter-group">
          <label htmlFor="city">City *</label>
          <div className="select-wrapper">
            <select
              id="city"
              value={filters.city}
              onChange={(e) => onFilterChange('city', e.target.value)}
              className="filter-select"
              disabled={!filters.state}
            >
              <option value="">Select City</option>
              {locations.cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Mandal Filter */}
        <div className="filter-group">
          <label htmlFor="mandal">Mandal/Taluk *</label>
          <div className="select-wrapper">
            <select
              id="mandal"
              value={filters.mandal}
              onChange={(e) => onFilterChange('mandal', e.target.value)}
              className="filter-select"
              disabled={!filters.city}
            >
              <option value="">Select Mandal</option>
              {locations.mandals.map(mandal => (
                <option key={mandal} value={mandal}>{mandal}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label htmlFor="category">Category *</label>
          <div className="select-wrapper">
            <select
              id="category"
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="filter-select"
              disabled={!filters.mandal}
            >
              <option value="">Select Category</option>
              {categoryOptions.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Filter */}
        <div className="filter-group">
          <label htmlFor="type">Type *</label>
          <div className="select-wrapper">
            <select
              id="type"
              value={filters.type}
              onChange={(e) => onFilterChange('type', e.target.value)}
              className="filter-select"
              disabled={!filters.category}
            >
              <option value="">Select Type</option>
              {typeOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="filter-group filter-actions">
          <button 
            onClick={onSearch}
            className={`search-btn ${isSearchEnabled ? 'enabled' : 'disabled'}`}
            disabled={!isSearchEnabled}
          >
            <FaSearch />
            Search {categoryType === 'stores' ? 'Stores' : 'Services'}
          </button>
          
          {allFiltersSelected && (
            <button 
              onClick={onClearFilters}
              className="clear-filters-btn"
            >
              <FaTimes />
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {allFiltersSelected && (
        <div className="active-filters">
          <h4>Selected Path:</h4>
          <div className="filter-chips">
            <span className="filter-chip">
              State: {filters.state}
            </span>
            <span className="filter-chip">
              City: {filters.city}
            </span>
            <span className="filter-chip">
              Mandal: {filters.mandal}
            </span>
            <span className="filter-chip">
              Category: {filters.category}
            </span>
            <span className="filter-chip">
              Type: {filters.type}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;