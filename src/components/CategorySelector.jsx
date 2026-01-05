import React from 'react';
import { FaStore, FaTools } from 'react-icons/fa';
import './CategorySelector.css';

const CategorySelector = ({ categoryType, onCategoryTypeChange, categories }) => {
  const storeCount = Object.keys(categories.stores || {}).length;
  const serviceCount = Object.keys(categories.services || {}).length;

  return (
    <div className="category-selector">
      <h3>Directory Type</h3>
      <div className="category-options">
        <button
          className={`category-option ${categoryType === 'stores' ? 'active' : ''}`}
          onClick={() => onCategoryTypeChange('stores')}
        >
          <FaStore />
          <div className="option-content">
            <span className="option-title">Stores</span>
            <span className="option-count">{storeCount} categories</span>
          </div>
        </button>
        
        <button
          className={`category-option ${categoryType === 'services' ? 'active' : ''}`}
          onClick={() => onCategoryTypeChange('services')}
        >
          <FaTools />
          <div className="option-content">
            <span className="option-title">Services</span>
            <span className="option-count">{serviceCount} categories</span>
          </div>
        </button>
      </div>
      
      <div className="category-info">
        <p>
          {categoryType === 'stores' 
            ? 'Find physical stores selling products' 
            : 'Find service providers offering expertise'}
        </p>
        <small>Select a type to filter available categories</small>
      </div>
    </div>
  );
};

export default CategorySelector;