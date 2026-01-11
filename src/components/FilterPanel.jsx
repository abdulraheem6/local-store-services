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
  console.log('FilterPanel locations:', locations);
  console.log('FilterPanel filters:', filters);
  
  // Extract data for rendering with safety checks
  const states = Array.isArray(locations.states) ? locations.states : [];
  const cities = Array.isArray(locations.cities) ? locations.cities : [];
  const mandals = Array.isArray(locations.mandals) ? locations.mandals : [];
  const categoryOptions = Object.keys(categories || {});
  
  // Check if we have data
  const hasStates = states.length > 0;
  const hasCities = cities.length > 0 && filters.state;
  const hasMandals = mandals.length > 0 && filters.city;
  const hasCategories = categoryOptions.length > 0 && filters.mandal;
  const hasTypes = typeOptions.length > 0 && filters.category;
  
  // Check if all filters are selected
  const allFiltersSelected = Boolean(
    filters.state && 
    filters.city && 
    filters.mandal && 
    filters.category && 
    filters.type
  );

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

      {/* Filter Progress Indicator */}
      <div className="filter-progress">
        <div className={`progress-step ${filters.state ? 'completed' : ''}`}>
          <span className="step-number">1</span>
          <span className="step-label">State</span>
        </div>
        <div className={`progress-step ${filters.city ? 'completed' : ''}`}>
          <span className="step-number">2</span>
          <span className="step-label">City</span>
        </div>
        <div className={`progress-step ${filters.mandal ? 'completed' : ''}`}>
          <span className="step-number">3</span>
          <span className="step-label">Mandal</span>
        </div>
        <div className={`progress-step ${filters.category ? 'completed' : ''}`}>
          <span className="step-number">4</span>
          <span className="step-label">Category</span>
        </div>
        <div className={`progress-step ${filters.type ? 'completed' : ''}`}>
          <span className="step-number">5</span>
          <span className="step-label">Type</span>
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
              {hasStates ? (
                states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))
              ) : (
                <option value="" disabled>Loading states...</option>
              )}
            </select>
          </div>
          {!hasStates && filters.state && (
            <small className="filter-hint">No states available</small>
          )}
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
              <option value="">
                {filters.state ? 'Select City' : 'Select State First'}
              </option>
              {hasCities ? (
                cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))
              ) : filters.state ? (
                <option value="" disabled>No cities found for {filters.state}</option>
              ) : null}
            </select>
          </div>
          {filters.state && !hasCities && (
            <small className="filter-hint">Select a state to see cities</small>
          )}
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
              <option value="">
                {filters.city ? 'Select Mandal' : 'Select City First'}
              </option>
              {hasMandals ? (
                mandals.map(mandal => (
                  <option key={mandal} value={mandal}>{mandal}</option>
                ))
              ) : filters.city ? (
                <option value="" disabled>No mandals found for {filters.city}</option>
              ) : null}
            </select>
          </div>
          {filters.city && !hasMandals && (
            <small className="filter-hint">Select a city to see mandals</small>
          )}
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
              <option value="">
                {filters.mandal ? 'Select Category' : 'Select Mandal First'}
              </option>
              {hasCategories ? (
                categoryOptions.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))
              ) : filters.mandal ? (
                <option value="" disabled>No categories available</option>
              ) : null}
            </select>
          </div>
          {filters.mandal && !hasCategories && (
            <small className="filter-hint">Select a mandal to see categories</small>
          )}
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
              <option value="">
                {filters.category ? 'Select Type' : 'Select Category First'}
              </option>
              {hasTypes ? (
                typeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))
              ) : filters.category ? (
                <option value="" disabled>No types found for {filters.category}</option>
              ) : null}
            </select>
          </div>
          {filters.category && !hasTypes && (
            <small className="filter-hint">Select a category to see types</small>
          )}
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

          {/*  */}
          
          {/*  */}
        </div>
        {/*Desktop ICon starthere */}
        <div className="filter-group filter-actions desktop-only">
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
        {/* above line end */}
        {/* mobile view starhere  */}
        {/* Mobile Search Button (Fixed at bottom) */}
        <div className="mobile-search-container">
          <button 
            onClick={onSearch}
            className={`mobile-search-btn ${isSearchEnabled ? 'enabled' : 'disabled'}`}
            disabled={!isSearchEnabled}
          >
            <FaSearch />
            <span>Search {categoryType === 'stores' ? 'Stores' : 'Services'}</span>
          </button>
        </div>
        {/* endhere */}
      </div>

      {/* Active Filters Display */}
      {allFiltersSelected && (
        <div className="active-filters">
          <h4>Selected Filters:</h4>
          <div className="filter-chips">
            <span className="filter-chip">
              State: {filters.state}
              <button onClick={() => onFilterChange('state', '')}>×</button>
            </span>
            <span className="filter-chip">
              City: {filters.city}
              <button onClick={() => onFilterChange('city', '')}>×</button>
            </span>
            <span className="filter-chip">
              Mandal: {filters.mandal}
              <button onClick={() => onFilterChange('mandal', '')}>×</button>
            </span>
            <span className="filter-chip">
              Category: {filters.category}
              <button onClick={() => onFilterChange('category', '')}>×</button>
            </span>
            <span className="filter-chip">
              Type: {filters.type}
              <button onClick={() => onFilterChange('type', '')}>×</button>
            </span>
          </div>
        </div>
      )}

      {/* Debug Info - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="filter-debug">
          <details>
            <summary>Debug Info</summary>
            <pre>
              States: {JSON.stringify(states, null, 2)}
              Cities: {JSON.stringify(cities, null, 2)}
              Mandals: {JSON.stringify(mandals, null, 2)}
              Selected State: {filters.state}
              Selected City: {filters.city}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
