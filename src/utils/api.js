import axios from 'axios';

// Determine API base URL based on environment
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:8787/api';
  }
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    
    if (import.meta.env.DEV) {
      return Promise.resolve(getFallbackData(error.config?.url, error.config?.params));
    }
    
    return Promise.reject(error);
  }
);

// Fetch about data
export const fetchAboutData = async () => {
  try {
    return await api.get('/about');
  } catch (error) {
    return getFallbackData('/about');
  }
};

// Fetch ads data
export const fetchAdsData = async () => {
  try {
    return await api.get('/ads');
  } catch (error) {
    return getFallbackData('/ads');
  }
};

// Fetch locations hierarchy
export const fetchLocations = async (state = null, city = null) => {
  try {
    const params = {};
    if (state) params.state = state;
    if (city) params.city = city;
    
    return await api.get('/locations', { params });
  } catch (error) {
    return getFallbackLocations(state, city);
  }
};

// Fetch categories and types
export const fetchCategories = async () => {
  try {
    return await api.get('/categories');
  } catch (error) {
    return getFallbackCategories();
  }
};

// Fetch stores with hierarchical filtering
export const fetchStores = async (filters = {}, page = 1, limit = 10) => {
  try {
    const params = {
      page,
      limit,
      ...filters
    };
    
    return await api.get('/stores', { params });
  } catch (error) {
    return getFallbackStores(filters, page, limit);
  }
};

// Fetch services with hierarchical filtering
export const fetchServices = async (filters = {}, page = 1, limit = 10) => {
  try {
    const params = {
      page,
      limit,
      ...filters
    };
    
    return await api.get('/services', { params });
  } catch (error) {
    return getFallbackServices(filters, page, limit);
  }
};

// Search across all data
export const searchAll = async (query, categoryType = 'all', filters = {}, page = 1, limit = 10) => {
  try {
    return await api.post('/search', {
      query,
      categoryType,
      filters: { ...filters, page, limit }
    });
  } catch (error) {
    return getFallbackSearch(query, categoryType, filters, page, limit);
  }
};

// Get all stores (flat)
export const fetchAllStores = async (page = 1, limit = 20) => {
  try {
    return await api.get('/all-stores', { params: { page, limit } });
  } catch (error) {
    return getFallbackAllStores(page, limit);
  }
};

// Get all services (flat)
export const fetchAllServices = async (page = 1, limit = 20) => {
  try {
    return await api.get('/all-services', { params: { page, limit } });
  } catch (error) {
    return getFallbackAllServices(page, limit);
  }
};

// Fallback data functions
const getFallbackData = (endpoint) => {
  console.log(`Using fallback data for: ${endpoint}`);
  
  if (endpoint.includes('/about')) {
    return {
      title: "Local Stores & Services Directory",
      description: "Find local stores and services organized by location and category",
      features: [
        "Hierarchical organization (State > City > Mandal > Category > Type)",
        "Separate stores and services directories",
        "Advanced filtering and search",
        "Dark/Light mode toggle"
      ],
      contact: "contact@localdirectory.com",
      version: "2.0.0",
      structure: "hierarchical"
    };
  }
  
  if (endpoint.includes('/ads')) {
    return [
      {
        id: 1,
        title: "List Your Business",
        content: "Get featured in our hierarchical directory",
        link: "#",
        type: "featured"
      }
    ];
  }
  
  return null;
};

const getFallbackLocations = (state, city) => {
  if (state && city) {
    // Return mandals for the city
    return ["Mandal 1", "Mandal 2", "Mandal 3"];
  } else if (state) {
    // Return cities for the state
    return ["City 1", "City 2", "City 3"];
  } else {
    // Return all states
    return ["Telangana", "Andhra Pradesh", "Karnataka", "Maharashtra", "Tamil Nadu"];
  }
};

const getFallbackCategories = () => {
  return {
    stores: {
      Grocery: ["Supermarket", "Kirana Store"],
      Electronics: ["Mobile Shop", "Computer Shop"],
      Clothing: ["Footwear Shop", "Garment Shop"]
    },
    services: {
      Repair: ["Electrician", "Plumber"],
      Beauty: ["Salon", "Spa"],
      Education: ["Tution", "Coaching"]
    }
  };
};

const getFallbackStores = (filters, page, limit) => {
  const startIndex = (page - 1) * limit;
  const stores = Array.from({ length: 50 }, (_, i) => ({
    id: `store-${i + 1}`,
    name: `Store ${i + 1}`,
    description: "Sample store description",
    state: filters.state || "Telangana",
    city: filters.city || "Hyderabad",
    mandal: filters.mandal || "Serilingampally",
    category: filters.category || "Grocery",
    serviceType: filters.type || "Supermarket",
    phone: "+91 9876543210",
    rating: 4.0 + (i % 5) / 10,
    tags: ["Sample", "Fallback"]
  }));
  
  const paginated = stores.slice(startIndex, startIndex + limit);
  
  return {
    data: paginated,
    pagination: {
      page,
      limit,
      total: stores.length,
      totalPages: Math.ceil(stores.length / limit),
      hasNext: startIndex + limit < stores.length,
      hasPrev: page > 1
    },
    filters,
    hierarchy: []
  };
};

const getFallbackServices = (filters, page, limit) => {
  const startIndex = (page - 1) * limit;
  const services = Array.from({ length: 50 }, (_, i) => ({
    id: `service-${i + 1}`,
    name: `Service ${i + 1}`,
    description: "Sample service description",
    state: filters.state || "Telangana",
    city: filters.city || "Hyderabad",
    mandal: filters.mandal || "Serilingampally",
    category: filters.category || "Repair",
    serviceType: filters.type || "Electrician",
    phone: "+91 9876543210",
    rating: 4.0 + (i % 5) / 10,
    tags: ["Sample", "Fallback"]
  }));
  
  const paginated = services.slice(startIndex, startIndex + limit);
  
  return {
    data: paginated,
    pagination: {
      page,
      limit,
      total: services.length,
      totalPages: Math.ceil(services.length / limit),
      hasNext: startIndex + limit < services.length,
      hasPrev: page > 1
    },
    filters,
    hierarchy: []
  };
};

const getFallbackSearch = (query, categoryType, filters, page, limit) => {
  const startIndex = (page - 1) * limit;
  const items = Array.from({ length: 100 }, (_, i) => ({
    id: `item-${i + 1}`,
    name: `${query ? query + ' ' : ''}Item ${i + 1}`,
    description: "Sample item description",
    type: categoryType === 'all' ? (i % 2 === 0 ? 'store' : 'service') : categoryType,
    category: i % 2 === 0 ? "Grocery" : "Repair",
    serviceType: i % 2 === 0 ? "Supermarket" : "Electrician",
    rating: 4.0 + (i % 5) / 10
  }));
  
  const paginated = items.slice(startIndex, startIndex + limit);
  
  return {
    data: paginated,
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
      hasNext: startIndex + limit < items.length,
      hasPrev: page > 1
    },
    categoryType,
    query
  };
};

const getFallbackAllStores = (page, limit) => {
  return getFallbackStores({}, page, limit);
};

const getFallbackAllServices = (page, limit) => {
  return getFallbackServices({}, page, limit);
};

export default api;
