import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DataProvider } from './context/DataContext'
import StoreCard from './components/storeCard';
import FilterPanel from './components/FilterPanel';
import Pagination from './components/Pagination';
import AdsSection from './components/AdsSection';
import AboutSection from './components/AboutSection';
import CategorySelector from './components/CategorySelector';
import Navigation from './components/Navigation'; // New component
import { 
  fetchAboutData, 
  fetchAdsData, 
  fetchCategories,
  fetchStores,
  fetchServices
} from './utils/api';
import axios from 'axios';
import './App.css';

// Lazy load registration page for better performance
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const HomePage = lazy(() => import('./pages/HomePage'));

// Loading component for lazy loading
const LoadingFallback = () => (
  <div className="loading-fallback">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// Navigation Component
const AppNavigation = () => {
  const { theme } = useTheme();
  const location = useLocation();
  
  return (
    <Navigation theme={theme} currentPath={location.pathname} />
  );
};

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
    cities: [],
    mandals: []
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

  // Check if we're on a specific route
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isStoresPage = location.pathname === '/stores';
  const isRegisterPage = location.pathname === '/register';

  // Initialize data - only on main pages
  useEffect(() => {
    if (isHomePage || isStoresPage) {
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
    }
  }, [isHomePage, isStoresPage]);

  // Update cities when state changes
  useEffect(() => {
    if (filters.state) {
      const citiesForState = fullLocations.cities[filters.state];
      
      setLocations(prev => ({ 
        ...prev, 
        cities: Array.isArray(citiesForState) ? citiesForState : [],
        mandals: [] 
      }));
      
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
    if (filters.state && filters.city) {
      const mandalsForCity = fullLocations.mandals[filters.city];
      
      setLocations(prev => ({ 
        ...prev, 
        mandals: Array.isArray(mandalsForCity) ? mandalsForCity : [] 
      }));
      
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
      console.log('Search not enabled. Missing filters:', filters);
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
      
      const itemsData = Array.isArray(response.data) ? response.data : [];
      const pagination = response.pagination || {
        total: 0,
        totalPages: 0,
        page: currentPage,
        limit: itemsPerPage,
        hasNext: false,
        hasPrev: false
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

  // Function to handle new store registration
  const handleNewStoreAdded = (newStore) => {
    // This can be used to update local state or trigger refresh
    console.log('New store added:', newStore);
    // You could show a notification or update the stores list
  };

  // Render the main directory content (for / and /stores routes)
  const renderDirectoryContent = () => {
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
              
              {/* Register Store Card in Sidebar */}
              <div className="register-promo-card">
                <h3>Own a Business?</h3>
                <p>Register your store or service in our directory</p>
                <Link to="/register" className="register-promo-btn">
                  Add Your Business
                </Link>
              </div>
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
                      <Link to="/register" className="add-store-btn">
                        + Add New
                      </Link>
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
                      <div className="no-results-actions">
                        <button onClick={clearFilters} className="retry-btn">
                          Clear Filters
                        </button>
                        <Link to="/register" className="add-store-btn">
                          Register a Business Here
                        </Link>
                      </div>
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
                <Link to="/register" className="register-link">
                  📝 Add Your Business
                </Link>
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
              <Link to="/register">Register Business</Link>
              <Link to="/stores">Browse Directory</Link>
              <span>Deployed on Cloudflare Pages</span>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  return (
    <>
      <AppNavigation />
      {renderDirectoryContent()}
    </>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <DataProvider>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<AppContent />} />
            <Route path="/stores" element={<AppContent />} />
            <Route 
              path="/register" 
              element={<RegistrationPage />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
         </DataProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;



// // 2. Wrap your App with DataProvider to pass location categoris information to buttom
// // Update src/main.jsx or src/App.jsx


// // import React from 'react';
// // import ReactDOM from 'react-dom/client';
// // import { DataProvider } from './context/DataContext';
// // import { ThemeProvider } from './context/ThemeContext';
// // import App from './App';
// // import './index.css';

// // ReactDOM.createRoot(document.getElementById('root')).render(
// //   <React.StrictMode>
// //     <DataProvider>
// //       <ThemeProvider>
// //         <App />
// //       </ThemeProvider>
// //     </DataProvider>
// //   </React.StrictMode>
// // );

// import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
// import { ThemeProvider, useTheme } from './context/ThemeContext';
// import { DataProvider } from './context/DataContext'
// import StoreCard from './components/storeCard';
// import FilterPanel from './components/FilterPanel';
// import Pagination from './components/Pagination';
// import AdsSection from './components/AdsSection';
// import AboutSection from './components/AboutSection';
// import CategorySelector from './components/CategorySelector';
// import Navigation from './components/Navigation';
// import { 
//   fetchAboutData, 
//   fetchAdsData, 
//   fetchCategories,
//   fetchStores,
//   fetchServices
// } from './utils/api';
// import axios from 'axios';
// import './App.css';

// // Lazy load components
// const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
// const HomePage = lazy(() => import('./pages/HomePage'));

// // New components for Zomato/Google Maps style
// const MapView = lazy(() => import('./components/MapView'));
// const ListView = lazy(() => import('./components/ListView'));
// const SearchBar = lazy(() => import('./components/SearchBar'));

// const LoadingFallback = () => (
//   <div className="loading-fallback">
//     <div className="spinner"></div>
//     <p>Loading...</p>
//   </div>
// );

// const AppNavigation = () => {
//   const { theme } = useTheme();
//   const location = useLocation();
  
//   return (
//     <Navigation theme={theme} currentPath={location.pathname} />
//   );
// };

// function AppContent() {
//   const { theme, toggleTheme } = useTheme();
//   const [items, setItems] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(6);
//   const [aboutData, setAboutData] = useState(null);
//   const [adsData, setAdsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchPerformed, setSearchPerformed] = useState(false);
//   const [totalItems, setTotalItems] = useState(0);
//   const [totalPages, setTotalPages] = useState(0);
//   const [categoryType, setCategoryType] = useState('stores');
//   const [locations, setLocations] = useState({
//     states: [],
//     cities: [],
//     mandals: []
//   });
//   const [fullLocations, setFullLocations] = useState({
//     states: [],
//     cities: {},
//     mandals: {}
//   });
//   const [categories, setCategories] = useState({
//     stores: {},
//     services: {}
//   });
//   const [typeOptions, setTypeOptions] = useState([]);
//   const [error, setError] = useState(null);
//   const [filters, setFilters] = useState({
//     state: '',
//     city: '',
//     mandal: '',
//     category: '',
//     type: ''
//   });
  
//   // New states for Zomato/Google Maps style
//   const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortBy, setSortBy] = useState('rating'); // 'rating', 'name', 'distance'
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [userLocation, setUserLocation] = useState(null);
//   const [mapCenter, setMapCenter] = useState({ lat: 17.3850, lng: 78.4867 }); // Default Hyderabad
//   const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

//   const locationHook = useLocation();
//   const isHomePage = locationHook.pathname === '/';
//   const isStoresPage = locationHook.pathname === '/stores';
//   const isRegisterPage = locationHook.pathname === '/register';

//   // Get user location
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setUserLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           });
//           setMapCenter({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           });
//         },
//         (error) => {
//           console.log('Geolocation error:', error);
//         }
//       );
//     }
//   }, []);

//   // Initialize data
//   useEffect(() => {
//     if (isHomePage || isStoresPage) {
//       const initData = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//           // Fetch about data
//           const about = await fetchAboutData();
//           setAboutData(about);
          
//           // Fetch ads data
//           const ads = await fetchAdsData();
//           setAdsData(Array.isArray(ads) ? ads : []);
          
//           // Fetch full locations data
//           try {
//             const apiBaseUrl = import.meta.env.DEV ? 'http://localhost:8787/api' : '/api';
//             const response = await axios.get(`${apiBaseUrl}/locations`);
            
//             if (response.data && typeof response.data === 'object') {
//               const locationsData = {
//                 states: Array.isArray(response.data.states) ? response.data.states : [],
//                 cities: response.data.cities || {},
//                 mandals: response.data.mandals || {}
//               };
              
//               setFullLocations(locationsData);
//               setLocations(prev => ({ 
//                 ...prev, 
//                 states: locationsData.states 
//               }));
//             } else {
//               throw new Error('Invalid locations response format');
//             }
//           } catch (locationsError) {
//             console.error('Error fetching locations:', locationsError);
//             // Set fallback locations
//             const fallbackLocations = {
//               states: ["Telangana", "Andhra Pradesh", "Karnataka", "Maharashtra", "Tamil Nadu"],
//               cities: {
//                 "Telangana": ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam"],
//                 "Andhra Pradesh": ["Vijayawada", "Guntur", "Visakhapatnam", "Tirupati", "Kurnool"],
//                 "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
//                 "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
//                 "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"]
//               },
//               mandals: {
//                 "Hyderabad": ["Serilingampally", "Kukatpally", "Madhapur", "Gachibowli", "Banjara Hills", "Hitech City"],
//                 "Warangal": ["Warangal Urban", "Warangal Rural", "Hanamkonda", "Kazipet"],
//                 "Vijayawada": ["Vijayawada Urban", "Vijayawada Rural", "Mylavaram", "Nandigama"],
//                 "Bangalore": ["Bengaluru North", "Bengaluru South", "Bengaluru East", "Bengaluru West"],
//                 "Mumbai": ["Mumbai City", "Mumbai Suburban", "Andheri", "Bandra", "Dadar"]
//               }
//             };
            
//             setFullLocations(fallbackLocations);
//             setLocations({ 
//               states: fallbackLocations.states,
//               cities: [],
//               mandals: []
//             });
//           }
          
//           // Fetch categories
//           const cats = await fetchCategories();
//           setCategories(cats || { stores: {}, services: {} });
          
//         } catch (error) {
//           console.error('Error initializing data:', error);
//           setError('Failed to load directory data. Using fallback data.');
          
//           // Set fallback data
//           const fallbackLocations = {
//             states: ["Telangana", "Andhra Pradesh", "Karnataka"],
//             cities: {
//               "Telangana": ["Hyderabad", "Warangal"],
//               "Andhra Pradesh": ["Vijayawada", "Guntur"],
//               "Karnataka": ["Bangalore", "Mysore"]
//             },
//             mandals: {
//               "Hyderabad": ["Serilingampally", "Kukatpally"],
//               "Vijayawada": ["Vijayawada Urban", "Vijayawada Rural"],
//               "Bangalore": ["Bengaluru North", "Bengaluru South"]
//             }
//           };
          
//           setFullLocations(fallbackLocations);
//           setLocations({ 
//             states: fallbackLocations.states,
//             cities: [],
//             mandals: []
//           });
          
//           setAboutData({
//             title: "Local Stores & Services Directory",
//             description: "Find local businesses near you",
//             features: [
//               "Explore businesses on interactive map",
//               "Search by location and category",
//               "View ratings and reviews"
//             ],
//             contact: "contact@localdirectory.com",
//             version: "1.0.0"
//           });
          
//           setAdsData([
//             {
//               id: 1,
//               title: "Premium Business Listing",
//               content: "Get your business featured in our directory",
//               type: "premium"
//             }
//           ]);
          
//           setCategories({
//             stores: {
//               "Restaurants": ["Fine Dining", "Fast Food", "Cafe"],
//               "Shopping": ["Supermarket", "Clothing", "Electronics"],
//               "Entertainment": ["Movies", "Games", "Events"]
//             },
//             services: {
//               "Home Services": ["Cleaning", "Repair", "Plumbing"],
//               "Professional": ["Consulting", "Legal", "Accounting"],
//               "Health": ["Clinic", "Pharmacy", "Fitness"]
//             }
//           });
//         } finally {
//           setLoading(false);
//         }
//       };
      
//       initData();
//     }
//   }, [isHomePage, isStoresPage]);

//   // Update cities when state changes
//   useEffect(() => {
//     if (filters.state) {
//       const citiesForState = fullLocations.cities[filters.state];
      
//       setLocations(prev => ({ 
//         ...prev, 
//         cities: Array.isArray(citiesForState) ? citiesForState : [],
//         mandals: [] 
//       }));
      
//       setFilters(prev => ({ 
//         ...prev, 
//         city: '', 
//         mandal: '', 
//         category: '', 
//         type: '' 
//       }));
//       setTypeOptions([]);
//     } else {
//       setLocations(prev => ({ ...prev, cities: [], mandals: [] }));
//     }
//   }, [filters.state, fullLocations.cities]);

//   // Update mandals when city changes
//   useEffect(() => {
//     if (filters.state && filters.city) {
//       const mandalsForCity = fullLocations.mandals[filters.city];
      
//       setLocations(prev => ({ 
//         ...prev, 
//         mandals: Array.isArray(mandalsForCity) ? mandalsForCity : [] 
//       }));
      
//       setFilters(prev => ({ 
//         ...prev, 
//         mandal: '', 
//         category: '', 
//         type: '' 
//       }));
//       setTypeOptions([]);
//     } else {
//       setLocations(prev => ({ ...prev, mandals: [] }));
//     }
//   }, [filters.state, filters.city, fullLocations.mandals]);

//   // Update type options when category changes
//   useEffect(() => {
//     if (filters.category && categories[categoryType]) {
//       const types = categories[categoryType][filters.category] || [];
//       setTypeOptions(Array.isArray(types) ? types : []);
//       setFilters(prev => ({ 
//         ...prev, 
//         type: types.length > 0 ? types[0] : '' 
//       }));
//     } else {
//       setTypeOptions([]);
//       setFilters(prev => ({ ...prev, type: '' }));
//     }
//   }, [filters.category, categoryType, categories]);

//   const isSearchEnabled = useCallback(() => {
//     return (
//       filters.state &&
//       filters.city &&
//       filters.mandal &&
//       filters.category &&
//       filters.type
//     );
//   }, [filters]);

//   const handleSearch = async () => {
//     if (!isSearchEnabled()) {
//       console.log('Search not enabled. Missing filters:', filters);
//       return;
//     }
    
//     console.log('Searching with filters:', filters);
//     setCurrentPage(1);
//     setSearchPerformed(true);
//     await fetchData();
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       let response;
      
//       if (categoryType === 'stores') {
//         response = await fetchStores(filters, currentPage, itemsPerPage);
//       } else {
//         response = await fetchServices(filters, currentPage, itemsPerPage);
//       }
      
//       const itemsData = Array.isArray(response.data) ? response.data : [];
//       const pagination = response.pagination || {
//         total: 0,
//         totalPages: 0,
//         page: currentPage,
//         limit: itemsPerPage,
//         hasNext: false,
//         hasPrev: false
//       };
      
//       // Add mock coordinates for map display
//       const itemsWithCoords = itemsData.map((item, index) => ({
//         ...item,
//         coordinates: item.coordinates || {
//           lat: mapCenter.lat + (Math.random() - 0.5) * 0.05,
//           lng: mapCenter.lng + (Math.random() - 0.5) * 0.05
//         },
//         rating: item.rating || (4 + Math.random()).toFixed(1),
//         reviews: item.reviews || Math.floor(Math.random() * 100),
//         distance: item.distance || (Math.random() * 10).toFixed(1)
//       }));
      
//       setItems(itemsWithCoords);
//       setTotalItems(pagination.total || 0);
//       setTotalPages(pagination.totalPages || 0);
      
//       if (itemsWithCoords.length === 0) {
//         setError(`No ${categoryType} found for the selected criteria. Try different filters.`);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//       setItems([]);
//       setError(`Failed to load ${categoryType}. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (searchPerformed && isSearchEnabled()) {
//       fetchData();
//     }
//   }, [currentPage, searchPerformed]);

//   const handleFilterChange = (filterType, value) => {
//     console.log('Filter changed:', filterType, '=', value);
    
//     setFilters(prev => {
//       const newFilters = { ...prev, [filterType]: value };
      
//       if (filterType === 'state') {
//         newFilters.city = '';
//         newFilters.mandal = '';
//         newFilters.category = '';
//         newFilters.type = '';
//       } else if (filterType === 'city') {
//         newFilters.mandal = '';
//         newFilters.category = '';
//         newFilters.type = '';
//       } else if (filterType === 'mandal') {
//         newFilters.category = '';
//         newFilters.type = '';
//       } else if (filterType === 'category') {
//         newFilters.type = '';
//       }
      
//       return newFilters;
//     });
    
//     setSearchPerformed(false);
//     setItems([]);
//   };

//   const handleCategoryTypeChange = (type) => {
//     console.log('Category type changed to:', type);
//     setCategoryType(type);
//     setFilters({
//       state: '',
//       city: '',
//       mandal: '',
//       category: '',
//       type: ''
//     });
//     setSearchPerformed(false);
//     setItems([]);
//     setLocations(prev => ({ 
//       ...prev, 
//       cities: [], 
//       mandals: [] 
//     }));
//     setTypeOptions([]);
//     setError(null);
//   };

//   const clearFilters = () => {
//     console.log('Clearing all filters');
//     setFilters({
//       state: '',
//       city: '',
//       mandal: '',
//       category: '',
//       type: ''
//     });
//     setSearchPerformed(false);
//     setItems([]);
//     setCurrentPage(1);
//     setTotalItems(0);
//     setTotalPages(0);
//     setLocations(prev => ({ 
//       ...prev, 
//       cities: [], 
//       mandals: [] 
//     }));
//     setTypeOptions([]);
//     setError(null);
//   };

//   const handlePageChange = (page) => {
//     console.log('Page changed to:', page);
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // New handlers for Zomato/Google Maps features
//   const handleSearchQuery = (query) => {
//     setSearchQuery(query);
//     // Implement search logic here
//   };

//   const handleSortChange = (sortType) => {
//     setSortBy(sortType);
//     // Sort items based on sortType
//     const sortedItems = [...items].sort((a, b) => {
//       if (sortType === 'rating') {
//         return b.rating - a.rating;
//       } else if (sortType === 'distance') {
//         return parseFloat(a.distance) - parseFloat(b.distance);
//       } else if (sortType === 'name') {
//         return a.name.localeCompare(b.name);
//       }
//       return 0;
//     });
//     setItems(sortedItems);
//   };

//   const handleItemSelect = (item) => {
//     setSelectedItem(item);
//     if (item.coordinates) {
//       setMapCenter(item.coordinates);
//     }
//   };

//   const getHierarchyPath = () => {
//     const path = [];
//     if (filters.state) path.push(filters.state);
//     if (filters.city) path.push(filters.city);
//     if (filters.mandal) path.push(filters.mandal);
//     if (filters.category) path.push(filters.category);
//     if (filters.type) path.push(filters.type);
//     return path.join(' → ');
//   };

//   const handleNewStoreAdded = (newStore) => {
//     console.log('New store added:', newStore);
//   };

//   const renderDirectoryContent = () => {
//     if (loading && !searchPerformed && !error) {
//       return (
//         <div className={`app-loading ${theme}`}>
//           <div className="spinner"></div>
//           <p>Loading Local Directory...</p>
//           <small>Fetching data from Cloudflare R2</small>
//         </div>
//       );
//     }

//     return (
//       <div className={`app ${theme}`}>
//         <header className="app-header">
//           <div className="header-content">
//             <div className="header-main">
//               <div className="logo-section">
//                 <h1 className="app-logo">📍 LocalDirectory</h1>
//                 <p className="app-tagline">{aboutData?.description || "Find businesses near you"}</p>
//               </div>
              
//               <div className="header-actions">
//                 <div className="search-bar-container">
//                   <input
//                     type="text"
//                     placeholder="Search for stores, services..."
//                     value={searchQuery}
//                     onChange={(e) => handleSearchQuery(e.target.value)}
//                     className="global-search"
//                   />
//                   <button className="search-btn">🔍</button>
//                 </div>
                
//                 <div className="header-buttons">
//                   <button 
//                     onClick={toggleTheme} 
//                     className="theme-toggle-btn"
//                   >
//                     {theme === 'dark' ? '☀️' : '🌙'}
//                   </button>
//                   <Link to="/register" className="add-business-btn">
//                     + Add Business
//                   </Link>
//                 </div>
//               </div>
//             </div>
            
//             {error && !searchPerformed && (
//               <div className="header-warning">
//                 ⚠️ Using fallback data - API connection issue
//               </div>
//             )}
//           </div>
//         </header>

//         <main className="app-main">
//           <div className="content-wrapper">
//             {/* Left Sidebar - Filters */}
//             <aside className={`sidebar left-sidebar ${isFilterPanelOpen ? 'open' : ''}`}>
//               <div className="sidebar-header">
//                 <h3>Filters</h3>
//                 <button 
//                   className="close-filters"
//                   onClick={() => setIsFilterPanelOpen(false)}
//                 >
//                   ×
//                 </button>
//               </div>
              
//               <CategorySelector 
//                 categoryType={categoryType}
//                 onCategoryTypeChange={handleCategoryTypeChange}
//                 categories={categories}
//               />
              
//               <FilterPanel
//                 filters={filters}
//                 locations={locations}
//                 categories={categories[categoryType] || {}}
//                 typeOptions={typeOptions}
//                 categoryType={categoryType}
//                 onFilterChange={handleFilterChange}
//                 onClearFilters={clearFilters}
//                 onSearch={handleSearch}
//                 isSearchEnabled={isSearchEnabled()}
//               />
              
//               <div className="sort-section">
//                 <h4>Sort By</h4>
//                 <div className="sort-options">
//                   <button 
//                     className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
//                     onClick={() => handleSortChange('rating')}
//                   >
//                     ⭐ Rating
//                   </button>
//                   <button 
//                     className={`sort-btn ${sortBy === 'distance' ? 'active' : ''}`}
//                     onClick={() => handleSortChange('distance')}
//                   >
//                     📍 Distance
//                   </button>
//                   <button 
//                     className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
//                     onClick={() => handleSortChange('name')}
//                   >
//                     🔤 Name
//                   </button>
//                 </div>
//               </div>
//             </aside>

//             {/* Main Content Area */}
//             <div className="main-content">
//               <div className="content-header">
//                 <div className="view-toggle">
//                   <button 
//                     className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
//                     onClick={() => setViewMode('list')}
//                   >
//                     📋 List View
//                   </button>
//                   <button 
//                     className={`view-toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
//                     onClick={() => setViewMode('map')}
//                   >
//                     🗺️ Map View
//                   </button>
//                   <button 
//                     className="mobile-filter-btn"
//                     onClick={() => setIsFilterPanelOpen(true)}
//                   >
//                     🔍 Filters
//                   </button>
//                 </div>
                
//                 {searchPerformed && (
//                   <div className="results-summary">
//                     <div className="summary-info">
//                       <h2>
//                         {totalItems} {categoryType === 'stores' ? 'Store' : 'Service'}{totalItems !== 1 ? 's' : ''} Found
//                         <span className="location-badge">
//                           📍 {getHierarchyPath()}
//                         </span>
//                       </h2>
//                       <div className="summary-stats">
//                         <span>⭐ {items.length > 0 ? items[0].rating : '4.5'}+ Rating</span>
//                         <span>🚗 {items.length > 0 ? items[0].distance : '2.5'} km avg</span>
//                       </div>
//                     </div>
                    
//                     <div className="summary-actions">
//                       <button onClick={clearFilters} className="action-btn secondary">
//                         Clear Search
//                       </button>
//                       <Link to="/register" className="action-btn primary">
//                         + Add Your Business
//                       </Link>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {!searchPerformed ? (
//                 <div className="welcome-section">
//                   <AboutSection aboutData={aboutData} categoryType={categoryType} />
                  
//                   <div className="featured-categories">
//                     <h3>Popular Categories</h3>
//                     <div className="categories-grid">
//                       {Object.keys(categories[categoryType] || {}).slice(0, 6).map(cat => (
//                         <div key={cat} className="category-card">
//                           <div className="category-icon">
//                             {categoryType === 'stores' ? '🏪' : '🔧'}
//                           </div>
//                           <h4>{cat}</h4>
//                           <small>{categories[categoryType][cat].length} types</small>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="results-container">
//                   {error && searchPerformed ? (
//                     <div className="no-results">
//                       <h3>{error}</h3>
//                       <button onClick={clearFilters} className="action-btn primary">
//                         Try Different Filters
//                       </button>
//                     </div>
//                   ) : items.length === 0 && !loading ? (
//                     <div className="no-results">
//                       <h3>No {categoryType} found matching your criteria</h3>
//                       <p>Try adjusting your filters or select a different category type</p>
//                       <div className="no-results-actions">
//                         <button onClick={clearFilters} className="action-btn secondary">
//                           Clear Filters
//                         </button>
//                         <Link to="/register" className="action-btn primary">
//                           Register a Business Here
//                         </Link>
//                       </div>
//                     </div>
//                   ) : viewMode === 'map' ? (
//                     <Suspense fallback={<LoadingFallback />}>
//                       <div className="map-results">
//                         <MapView
//                           items={items}
//                           center={mapCenter}
//                           userLocation={userLocation}
//                           onItemSelect={handleItemSelect}
//                           selectedItem={selectedItem}
//                         />
                        
//                         <div className="map-sidebar">
//                           <h4>Nearby {categoryType}</h4>
//                           <div className="nearby-list">
//                             {items.slice(0, 5).map(item => (
//                               <div 
//                                 key={item.id} 
//                                 className={`nearby-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
//                                 onClick={() => handleItemSelect(item)}
//                               >
//                                 <div className="nearby-item-header">
//                                   <h5>{item.name}</h5>
//                                   <span className="rating-badge">⭐ {item.rating}</span>
//                                 </div>
//                                 <p className="nearby-location">{item.address || item.location}</p>
//                                 <div className="nearby-info">
//                                   <span>🚗 {item.distance} km</span>
//                                   <span>💬 {item.reviews} reviews</span>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       </div>
//                     </Suspense>
//                   ) : (
//                     <Suspense fallback={<LoadingFallback />}>
//                       <ListView
//                         items={items}
//                         categoryType={categoryType}
//                         onItemSelect={handleItemSelect}
//                         sortBy={sortBy}
//                       />
//                     </Suspense>
//                   )}

//                   {viewMode === 'list' && totalPages > 1 && (
//                     <div className="pagination-container">
//                       <Pagination
//                         currentPage={currentPage}
//                         totalPages={totalPages}
//                         onPageChange={handlePageChange}
//                       />
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Right Sidebar - Ads and Info */}
//             <aside className="sidebar right-sidebar">
//               <div className="location-card">
//                 <h3>📍 Your Location</h3>
//                 {userLocation ? (
//                   <div className="location-info">
//                     <p>📍 Using your current location</p>
//                     <small>Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}</small>
//                   </div>
//                 ) : (
//                   <div className="location-info">
//                     <p>📍 Hyderabad, India</p>
//                     <small>Default location</small>
//                   </div>
//                 )}
//                 <button className="location-btn" onClick={() => {
//                   if (userLocation) {
//                     setMapCenter(userLocation);
//                   }
//                 }}>
//                   📍 Use My Location
//                 </button>
//               </div>
              
//               <AdsSection ads={adsData} />
              
//               {selectedItem && (
//                 <div className="selected-item-card">
//                   <h3>Selected Business</h3>
//                   <div className="selected-item-details">
//                     <h4>{selectedItem.name}</h4>
//                     <div className="item-rating">
//                       <span className="rating-stars">
//                         {'⭐'.repeat(Math.floor(selectedItem.rating))}
//                       </span>
//                       <span className="rating-value">{selectedItem.rating}</span>
//                       <span className="rating-count">({selectedItem.reviews} reviews)</span>
//                     </div>
//                     <p className="item-address">{selectedItem.address || selectedItem.location}</p>
//                     <div className="item-actions">
//                       <button className="action-btn small">📞 Call</button>
//                       <button className="action-btn small">📍 Directions</button>
//                       <button className="action-btn small">📝 Review</button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </aside>
//           </div>
//         </main>

//         <footer className="app-footer">
//           <div className="footer-content">
//             <div className="footer-section">
//               <h4>📍 LocalDirectory</h4>
//               <p>Find local businesses easily</p>
//             </div>
//             <div className="footer-section">
//               <h4>Quick Links</h4>
//               <div className="footer-links">
//                 <Link to="/register">Add Business</Link>
//                 <Link to="/stores">Browse Directory</Link>
//                 <a href="#">About Us</a>
//                 <a href="#">Contact</a>
//               </div>
//             </div>
//             <div className="footer-section">
//               <h4>Contact</h4>
//               <p>{aboutData?.contact || 'contact@localdirectory.com'}</p>
//               <small>Deployed on Cloudflare Pages</small>
//             </div>
//           </div>
//           <div className="footer-bottom">
//             <p>© 2024 LocalDirectory • Explore Local Businesses</p>
//           </div>
//         </footer>
//       </div>
//     );
//   };

//   return (
//     <>
//       <AppNavigation />
//       {renderDirectoryContent()}
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <ThemeProvider>
//         <DataProvider>
//           <Suspense fallback={<LoadingFallback />}>
//             <Routes>
//               <Route path="/" element={<AppContent />} />
//               <Route path="/stores" element={<AppContent />} />
//               <Route 
//                 path="/register" 
//                 element={<RegistrationPage />} 
//               />
//               <Route path="*" element={<Navigate to="/" replace />} />
//             </Routes>
//           </Suspense>
//         </DataProvider>
//       </ThemeProvider>
//     </Router>
//   );
// }

// export default App;
