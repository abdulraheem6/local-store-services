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
  fetchCategories,
  fetchStores,
  fetchServices
} from './utils/api';
import axios from 'axios';
import './App.css';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [aboutData, setAboutData] = useState(null);
  const [adsData, setAdsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryType, setCategoryType] = useState('stores');
  const [locations, setLocations] = useState({
    states: [],
    cities: [],    // Current cities for selected state
    mandals: []    // Current mandals for selected city
  });
  const [fullLocations, setFullLocations] = useState({
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
        
        // Fetch ads data
        const ads = await fetchAdsData();
        setAdsData(Array.isArray(ads) ? ads : []);
        
        // Fetch full locations data
        try {
          const apiBaseUrl = import.meta.env.DEV ? 'http://localhost:8787/api' : '/api';
          const response = await axios.get(`${apiBaseUrl}/locations`);
          
          if (response.data && typeof response.data === 'object') {
            const locationsData = {
              states: Array.isArray(response.data.states) ? response.data.states : [],
              cities: response.data.cities || {},
              mandals: response.data.mandals || {}
            };
            
            setFullLocations(locationsData);
            setLocations(prev => ({ 
              ...prev, 
              states: locationsData.states 
            }));
            
            console.log('Loaded locations:', {
              statesCount: locationsData.states.length,
              citiesKeys: Object.keys(locationsData.cities),
              mandalsKeys: Object.keys(locationsData.mandals)
            });
          } else {
            throw new Error('Invalid locations response format');
          }
        } catch (locationsError) {
          console.error('Error fetching locations:', locationsError);
          // Set fallback locations
          const fallbackLocations = {
            states: ["Telangana", "Andhra Pradesh", "Karnataka", "Maharashtra", "Tamil Nadu"],
            cities: {
              "Telangana": ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam"],
              "Andhra Pradesh": ["Vijayawada", "Guntur", "Visakhapatnam", "Tirupati", "Kurnool"],
              "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
              "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
              "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"]
            },
            mandals: {
              "Hyderabad": ["Serilingampally", "Kukatpally", "Madhapur", "Gachibowli", "Banjara Hills", "Hitech City"],
              "Warangal": ["Warangal Urban", "Warangal Rural", "Hanamkonda", "Kazipet"],
              "Vijayawada": ["Vijayawada Urban", "Vijayawada Rural", "Mylavaram", "Nandigama"],
              "Bangalore": ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Bengaluru West"],
              "Mumbai": ["Mumbai City", "Mumbai Suburban", "Andheri", "Bandra", "Dadar"]
            }
          };
          
          setFullLocations(fallbackLocations);
          setLocations({ 
            states: fallbackLocations.states,
            cities: [],
            mandals: []
          });
        }
        
        // Fetch categories
        const cats = await fetchCategories();
        setCategories(cats || { stores: {}, services: {} });
        
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Failed to load directory data. Using fallback data.');
        
        // Set comprehensive fallback data
        const fallbackLocations = {
          states: ["Telangana", "Andhra Pradesh", "Karnataka"],
          cities: {
            "Telangana": ["Hyderabad", "Warangal"],
            "Andhra Pradesh": ["Vijayawada", "Guntur"],
            "Karnataka": ["Bangalore", "Mysore"]
          },
          mandals: {
            "Hyderabad": ["Serilingampally", "Kukatpally"],
            "Vijayawada": ["Vijayawada Urban", "Vijayawada Rural"],
            "Bangalore": ["Bengaluru North", "Bengaluru South"]
          }
        };
        
        setFullLocations(fallbackLocations);
        setLocations({ 
          states: fallbackLocations.states,
          cities: [],
          mandals: []
        });
        
        setAboutData({
          title: "Local Stores & Services Directory",
          description: "Find local businesses organized by hierarchical location structure",
          features: [
            "State → City → Mandal → Category → Type hierarchy",
            "Separate directories for Stores and Services",
            "Advanced filtering system"
          ],
          contact: "contact@localdirectory.com",
          version: "1.0.0"
        });
        
        setAdsData([
          {
            id: 1,
            title: "Premium Business Listing",
            content: "Get your business featured in our directory",
            type: "premium"
          }
        ]);
        
        setCategories({
          stores: {
            "Grocery": ["Supermarket", "Kirana Store"],
            "Electronics": ["Mobile Shop", "Computer Shop"],
            "Clothing": ["Footwear Shop", "Garment Shop"]
          },
          services: {
            "Repair": ["Electrician", "Plumber"],
            "Beauty": ["Salon", "Spa"],
            "Education": ["Tution", "Coaching"]
          }
        });
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, []);

  // Update cities when state changes
  useEffect(() => {
    console.log('State changed to:', filters.state);
    console.log('Full locations cities:', fullLocations.cities);
    
    if (filters.state) {
      // Get cities for the selected state from fullLocations
      const citiesForState = fullLocations.cities[filters.state];
      console.log('Cities for state', filters.state, ':', citiesForState);
      
      setLocations(prev => ({ 
        ...prev, 
        cities: Array.isArray(citiesForState) ? citiesForState : [],
        mandals: [] 
      }));
      
      // Reset dependent filters
      setFilters(prev => ({ 
        ...prev, 
        city: '', 
        mandal: '', 
        category: '', 
        type: '' 
      }));
      setTypeOptions([]);
    } else {
      setLocations(prev => ({ ...prev, cities: [], mandals: [] }));
    }
  }, [filters.state, fullLocations.cities]);

  // Update mandals when city changes
  useEffect(() => {
    console.log('City changed to:', filters.city);
    console.log('Full locations mandals:', fullLocations.mandals);
    
    if (filters.state && filters.city) {
      // Get mandals for the selected city from fullLocations
      const mandalsForCity = fullLocations.mandals[filters.city];
      console.log('Mandals for city', filters.city, ':', mandalsForCity);
      
      setLocations(prev => ({ 
        ...prev, 
        mandals: Array.isArray(mandalsForCity) ? mandalsForCity : [] 
      }));
      
      // Reset dependent filters
      setFilters(prev => ({ 
        ...prev, 
        mandal: '', 
        category: '', 
        type: '' 
      }));
      setTypeOptions([]);
    } else {
      setLocations(prev => ({ ...prev, mandals: [] }));
    }
  }, [filters.state, filters.city, fullLocations.mandals]);

  // Update type options when category changes
  useEffect(() => {
    if (filters.category && categories[categoryType]) {
      const types = categories[categoryType][filters.category] || [];
      setTypeOptions(Array.isArray(types) ? types : []);
      setFilters(prev => ({ 
        ...prev, 
        type: types.length > 0 ? types[0] : '' 
      }));
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
    if (!isSearchEnabled()) {
      console.log('Search not enabled. Missing filters:', {
        state: filters.state,
        city: filters.city,
        mandal: filters.mandal,
        category: filters.category,
        type: filters.type
      });
      return;
    }
    
    console.log('Searching with filters:', filters);
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
        totalPages: 0,
        page: currentPage,
        limit: itemsPerPage,
        hasNext: false,
        hasPrev: false
      };
      
      console.log('Fetched data:', {
        count: itemsData.length,
        pagination,
        categoryType
      });
      
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
    console.log('Filter changed:', filterType, '=', value);
    
    setFilters(prev => {
      const newFilters = { ...prev, [filterType]: value };
      
      // Reset dependent filters based on hierarchy
      if (filterType === 'state') {
        newFilters.city = '';
        newFilters.mandal = '';
        newFilters.category = '';
        newFilters.type = '';
      } else if (filterType === 'city') {
        newFilters.mandal = '';
        newFilters.category = '';
        newFilters.type = '';
      } else if (filterType === 'mandal') {
        newFilters.category = '';
        newFilters.type = '';
      } else if (filterType === 'category') {
        newFilters.type = '';
      }
      
      return newFilters;
    });
    
    setSearchPerformed(false);
    setItems([]);
  };

  const handleCategoryTypeChange = (type) => {
    console.log('Category type changed to:', type);
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
    setLocations(prev => ({ 
      ...prev, 
      cities: [], 
      mandals: [] 
    }));
    setTypeOptions([]);
    setError(null);
  };

  const clearFilters = () => {
    console.log('Clearing all filters');
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
    setLocations(prev => ({ 
      ...prev, 
      cities: [], 
      mandals: [] 
    }));
    setTypeOptions([]);
    setError(null);
  };

  const handlePageChange = (page) => {
    console.log('Page changed to:', page);
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
            {error && !searchPerformed && (
              <small className="warning-text">⚠️ Using fallback data - API connection issue</small>
            )}
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
            
            {/* Debug info - remove in production */}
            {import.meta.env.DEV && (
              <div className="debug-info">
                <h4>Debug Info:</h4>
                <p>States: {locations.states.length}</p>
                <p>Cities: {locations.cities.length}</p>
                <p>Mandals: {locations.mandals.length}</p>
                <p>Filters: {Object.values(filters).filter(Boolean).length}/5</p>
              </div>
            )}
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
                          key={item.id || `item-${Math.random()}`} 
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

          {/* Right Sidebar */}
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
                <span className="stat-label">States Available:</span>
                <span className="stat-value">{locations.states.length}</span>
              </div>
              <small className="stat-footer">
                Hierarchical Data • Cloudflare R2
              </small>
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
