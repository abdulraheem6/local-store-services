import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import StoreCard from './components/storeCard';
import FilterPanel from './components/FilterPanel';
import Pagination from './components/Pagination';
import AdsSection from './components/AdsSection';
import AboutSection from './components/AboutSection';
import CategorySelector from './components/CategorySelector';
import { 
  fetchAboutData, 
  fetchAdsData, 
  fetchLocations, 
  fetchCategories,
  fetchStores,
  fetchServices
} from './utils/api';
import './App.css';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [aboutData, setAboutData] = useState(null);
  const [adsData, setAdsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryType, setCategoryType] = useState('stores'); // 'stores' or 'services'
  const [locations, setLocations] = useState({
    states: [],
    cities: [],
    mandals: []
  });
  const [categories, setCategories] = useState({
    stores: {},
    services: {}
  });
  const [typeOptions, setTypeOptions] = useState([]);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    mandal: '',
    category: '',
    type: ''
  });

  // Initialize data
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch about data
        const about = await fetchAboutData();
        setAboutData(about);
        
        // Fetch ads data
        const ads = await fetchAdsData();
        setAdsData(ads);
        
        // Fetch locations (states)
        const states = await fetchLocations();
        setLocations(prev => ({ ...prev, states }));
        
        // Fetch categories
        const cats = await fetchCategories();
        setCategories(cats);
        
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Failed to load directory data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);

  // Update cities when state changes
  useEffect(() => {
    const updateCities = async () => {
      if (filters.state) {
        setLoading(true);
        try {
          const cities = await fetchLocations(filters.state);
          setLocations(prev => ({ ...prev, cities, mandals: [] }));
          // Reset dependent filters
          setFilters(prev => ({ ...prev, city: '', mandal: '', category: '', type: '' }));
          setTypeOptions([]);
        } catch (error) {
          console.error('Error fetching cities:', error);
          setLocations(prev => ({ ...prev, cities: [], mandals: [] }));
        } finally {
          setLoading(false);
        }
      } else {
        setLocations(prev => ({ ...prev, cities: [], mandals: [] }));
      }
    };
    
    updateCities();
  }, [filters.state]);

  // Update mandals when city changes
  useEffect(() => {
    const updateMandals = async () => {
      if (filters.state && filters.city) {
        setLoading(true);
        try {
          const mandals = await fetchLocations(filters.state, filters.city);
          setLocations(prev => ({ ...prev, mandals }));
          // Reset dependent filters
          setFilters(prev => ({ ...prev, mandal: '', category: '', type: '' }));
          setTypeOptions([]);
        } catch (error) {
          console.error('Error fetching mandals:', error);
          setLocations(prev => ({ ...prev, mandals: [] }));
        } finally {
          setLoading(false);
        }
      } else {
        setLocations(prev => ({ ...prev, mandals: [] }));
      }
    };
    
    updateMandals();
  }, [filters.state, filters.city]);

  // Update type options when category changes
  useEffect(() => {
    if (filters.category && categories[categoryType]) {
      const types = categories[categoryType][filters.category] || [];
      setTypeOptions(types);
      setFilters(prev => ({ ...prev, type: types.length > 0 ? types[0] : '' }));
    } else {
      setTypeOptions([]);
      setFilters(prev => ({ ...prev, type: '' }));
    }
  }, [filters.category, categoryType, categories]);

  // Check if all filters are filled
  const isSearchEnabled = useCallback(() => {
    return (
      filters.state &&
      filters.city &&
      filters.mandal &&
      filters.category &&
      filters.type
    );
  }, [filters]);

  const handleSearch = async () => {
    if (!isSearchEnabled()) return;
    
    setCurrentPage(1);
    setSearchPerformed(true);
    await fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      
      if (categoryType === 'stores') {
        response = await fetchStores(filters, currentPage, itemsPerPage);
      } else {
        response = await fetchServices(filters, currentPage, itemsPerPage);
      }
      
      setItems(response.data || []);
      setTotalItems(response.pagination?.total || 0);
      setTotalPages(response.pagination?.totalPages || 0);
      
      if (response.data && response.data.length === 0) {
        setError(`No ${categoryType} found for the selected criteria. Try different filters.`);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setItems([]);
      setError(`Failed to load ${categoryType}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when page changes
  useEffect(() => {
    if (searchPerformed && isSearchEnabled()) {
      fetchData();
    }
  }, [currentPage, searchPerformed]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterType]: value };
      
      // Reset dependent filters based on hierarchy
      if (filterType === 'state') {
        newFilters.city = '';
        newFilters.mandal = '';
        newFilters.category = '';
        newFilters.type = '';
        setLocations(prev => ({ ...prev, cities: [], mandals: [] }));
        setTypeOptions([]);
      } else if (filterType === 'city') {
        newFilters.mandal = '';
        newFilters.category = '';
        newFilters.type = '';
        setLocations(prev => ({ ...prev, mandals: [] }));
        setTypeOptions([]);
      } else if (filterType === 'mandal') {
        newFilters.category = '';
        newFilters.type = '';
        setTypeOptions([]);
      } else if (filterType === 'category') {
        newFilters.type = '';
      }
      
      return newFilters;
    });
    setSearchPerformed(false);
    setItems([]);
  };

  const handleCategoryTypeChange = (type) => {
    setCategoryType(type);
    setFilters({
      state: '',
      city: '',
      mandal: '',
      category: '',
      type: ''
    });
    setSearchPerformed(false);
    setItems([]);
    setLocations({ states: locations.states, cities: [], mandals: [] });
    setTypeOptions([]);
    setError(null);
  };

  const clearFilters = () => {
    setFilters({
      state: '',
      city: '',
      mandal: '',
      category: '',
      type: ''
    });
    setSearchPerformed(false);
    setItems([]);
    setCurrentPage(1);
    setTotalItems(0);
    setTotalPages(0);
    setLocations({ states: locations.states, cities: [], mandals: [] });
    setTypeOptions([]);
    setError(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate hierarchy path for display
  const getHierarchyPath = () => {
    const path = [];
    if (filters.state) path.push(filters.state);
    if (filters.city) path.push(filters.city);
    if (filters.mandal) path.push(filters.mandal);
    if (filters.category) path.push(filters.category);
    if (filters.type) path.push(filters.type);
    return path.join(' → ');
  };

  if (loading && !searchPerformed && !error) {
    return (
      <div className={`app-loading ${theme}`}>
        <div className="spinner"></div>
        <p>Loading Local Directory...</p>
        <small>Fetching data from Cloudflare R2</small>
      </div>
    );
  }

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>{aboutData?.title || "Local Stores & Services Directory"}</h1>
            <p>{aboutData?.description || "Find businesses organized by location hierarchy"}</p>
            <small className="header-subtitle">
              Hierarchical Data: State → City → Mandal → Category → Type
            </small>
          </div>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="content-wrapper">
          {/* Left Sidebar - Category Selector & Ads */}
          <aside className="sidebar left-sidebar">
            <CategorySelector 
              categoryType={categoryType}
              onCategoryTypeChange={handleCategoryTypeChange}
              categories={categories}
            />
            <AdsSection ads={adsData} />
          </aside>

          {/* Main Content */}
          <div className="main-content">
            {error && !searchPerformed && (
              <div className="error-message">
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                  Refresh Page
                </button>
              </div>
            )}

            <FilterPanel
              filters={filters}
              locations={locations}
              categories={categories[categoryType] || {}}
              typeOptions={typeOptions}
              categoryType={categoryType}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
              onSearch={handleSearch}
              isSearchEnabled={isSearchEnabled()}
            />

            {!searchPerformed ? (
              <AboutSection aboutData={aboutData} categoryType={categoryType} />
            ) : (
              <div className="stores-container">
                <div className="results-info">
                  <div>
                    <h2>
                      {totalItems} {categoryType === 'stores' ? 'Store' : 'Service'}{totalItems !== 1 ? 's' : ''} Found
                    </h2>
                    {getHierarchyPath() && (
                      <p className="hierarchy-path">
                        <strong>Location:</strong> {getHierarchyPath()}
                      </p>
                    )}
                  </div>
                  <div className="results-actions">
                    {loading && <span className="loading-indicator">Loading...</span>}
                    <button onClick={clearFilters} className="clear-btn">
                      New Search
                    </button>
                  </div>
                </div>

                {error && searchPerformed ? (
                  <div className="no-results">
                    <h3>{error}</h3>
                    <button onClick={clearFilters} className="retry-btn">
                      Try Different Filters
                    </button>
                  </div>
                ) : items.length === 0 && !loading ? (
                  <div className="no-results">
                    <h3>No {categoryType} found matching your criteria</h3>
                    <p>Try adjusting your filters or select a different category type</p>
                    <button onClick={clearFilters} className="retry-btn">
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="stores-grid">
                      {items.map(item => (
                        <StoreCard 
                          key={item.id} 
                          item={item} 
                          categoryType={categoryType}
                        />
                      ))}
                    </div>
                    
                    {totalPages > 1 && (
                      <div className="pagination-container">
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                        <div className="pagination-info">
                          Showing {Math.min(items.length, itemsPerPage)} of {totalItems} {categoryType}
                          {' '} (Page {currentPage} of {totalPages})
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar - Stats & Ads */}
          <aside className="sidebar right-sidebar">
            <AdsSection ads={adsData?.slice(0, 2)} />
            <div className="stats-card">
              <h3>Directory Information</h3>
              <div className="stat-item">
                <span className="stat-label">Directory Type:</span>
                <span className="stat-value">{categoryType === 'stores' ? '🏪 Stores' : '🔧 Services'}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Current Results:</span>
                <span className="stat-value">{totalItems} items</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Filters Active:</span>
                <span className="stat-value">{Object.values(filters).filter(f => f).length}/5</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Data Source:</span>
                <span className="stat-value">Cloudflare R2</span>
              </div>
              <small className="stat-footer">
                Hierarchical Storage • Real-time Updates
              </small>
            </div>
            <div className="hierarchy-info">
              <h4>📁 Data Structure</h4>
              <ul>
                <li><strong>State</strong> → <strong>City</strong> → <strong>Mandal</strong></li>
                <li><strong>Category</strong> → <strong>Type</strong></li>
                <li>Separate: <strong>Stores</strong> & <strong>Services</strong></li>
              </ul>
              <p className="info-note">
                All data is stored in Cloudflare R2 with hierarchical organization for fast retrieval.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2024 Local Stores & Services Directory • Hierarchical Data System</p>
          <div className="footer-links">
            {aboutData?.contact && (
              <span>Contact: {aboutData.contact}</span>
            )}
            <span>Deployed on Cloudflare Pages</span>
            <span>Powered by R2 Storage</span>
          </div>
          <small className="footer-note">
            This directory uses a hierarchical data structure for efficient filtering and organization.
          </small>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;