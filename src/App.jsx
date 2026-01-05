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
  const [adsData, setAdsData] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryType, setCategoryType] = useState('stores');
  const [locations, setLocations] = useState({
    states: [],
    cities: {},
    mandals: {}
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
        
        // Fetch ads data - ensure it's an array
        const ads = await fetchAdsData();
        setAdsData(Array.isArray(ads) ? ads : []);
        
        // Fetch locations - get the full object
        const locationsResponse = await fetchFullLocations();
        setLocations(locationsResponse || { states: [], cities: {}, mandals: {} });
        
        // Fetch categories
        const cats = await fetchCategories();
        setCategories(cats || { stores: {}, services: {} });
        
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Failed to load directory data. Using fallback data.');
        
        // Set fallback data
        setAboutData({
          title: "Local Stores & Services Directory",
          description: "Find local businesses organized by hierarchical location structure",
          features: ["Hierarchical filtering", "Separate stores/services"],
          contact: "contact@localdirectory.com"
        });
        setAdsData([]);
        // Set fallback data with object structure
        setLocations({
          states: ["Telangana", "Andhra Pradesh"],
          cities: {
            "Telangana": ["Hyderabad", "Warangal"],
            "Andhra Pradesh": ["Vijayawada", "Guntur"]
          },
          mandals: {
            "Hyderabad": ["Serilingampally", "Kukatpally"],
            "Vijayawada": ["Vijayawada Urban", "Vijayawada Rural"]
          }
        });
        setCategories({
          stores: { "Grocery": ["Supermarket"], "Electronics": ["Mobile Shop"] },
          services: { "Repair": ["Electrician"], "Beauty": ["Salon"] }
        });
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);

  
    // Add a new function to fetch full locations object
  const fetchFullLocations = async () => {
    try {
      const response = await api.get('/locations');
      return {
        states: Array.isArray(response?.states) ? response.states : [],
        cities: response?.cities || {},
        mandals: response?.mandals || {}
      };
    } catch (error) {
      console.error('Error fetching full locations:', error);
      return null;
    }
  };
  
// Update cities when state changes - now using object
  useEffect(() => {
    if (filters.state) {
      const citiesForState = locations.cities[filters.state] || [];
      setLocations(prev => ({ 
        ...prev, 
        currentCities: citiesForState,
        currentMandals: []
      }));
      // Reset dependent filters
      setFilters(prev => ({ ...prev, city: '', mandal: '', category: '', type: '' }));
      setTypeOptions([]);
    } else {
      setLocations(prev => ({ ...prev, currentCities: [], currentMandals: [] }));
    }
  }, [filters.state, locations.cities]);


  // Update mandals when city changes - now using object
  useEffect(() => {
    if (filters.state && filters.city) {
      const mandalsForCity = locations.mandals[filters.city] || [];
      setLocations(prev => ({ 
        ...prev, 
        currentMandals: mandalsForCity 
      }));
      // Reset dependent filters
      setFilters(prev => ({ ...prev, mandal: '', category: '', type: '' }));
      setTypeOptions([]);
    } else {
      setLocations(prev => ({ ...prev, currentMandals: [] }));
    }
  }, [filters.state, filters.city, locations.mandals]);

  // Update type options when category changes
  useEffect(() => {
    if (filters.category && categories[categoryType]) {
      const types = categories[categoryType][filters.category] || [];
      setTypeOptions(Array.isArray(types) ? types : []);
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
      
      // Ensure response has the expected structure
      const itemsData = Array.isArray(response.data) ? response.data : [];
      const pagination = response.pagination || {
        total: 0,
        totalPages: 0
      };
      
      setItems(itemsData);
      setTotalItems(pagination.total || 0);
      setTotalPages(pagination.totalPages || 0);
      
      if (itemsData.length === 0) {
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

  if (loading && !searchPerformed && !error) {
    return (
      <div className={`app-loading ${theme}`}>
        <div className="spinner"></div>
        <p>Loading Local Directory...</p>
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
          </div>
          <button onClick={toggleTheme} className="theme-toggle">
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="content-wrapper">
          {/* Left Sidebar */}
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
                    <p>Try adjusting your filters</p>
                  </div>
                ) : (
                  <>
                    <div className="stores-grid">
                      {items.map(item => (
                        <StoreCard 
                          key={item.id || Math.random()} 
                          item={item} 
                          categoryType={categoryType}
                        />
                      ))}
                    </div>
                    
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="sidebar right-sidebar">
            <AdsSection ads={adsData?.slice(0, 2)} />
          </aside>
        </div>
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2024 Local Stores & Services Directory</p>
          {aboutData?.contact && (
            <p>Contact: {aboutData.contact}</p>
          )}
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
