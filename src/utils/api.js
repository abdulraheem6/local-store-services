import axios from 'axios';

// Determine API base URL
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:8787/api';
  }
  return '/api';
};

const API_BASE_URL = getApiBaseUrl();

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
    
    // Return fallback data for development
    if (import.meta.env.DEV) {
      return Promise.resolve(getFallbackData(error.config?.url, error.config?.params));
    }
    
    return Promise.reject(error);
  }
);

// Fetch about data
export const fetchAboutData = async () => {
  try {
    const response = await api.get('/about');
    return response || getFallbackData('/about');
  } catch (error) {
    console.error('Error fetching about data:', error);
    return getFallbackData('/about');
  }
};

// Fetch ads data
export const fetchAdsData = async () => {
  try {
    const response = await api.get('/ads');
    return Array.isArray(response) ? response : getFallbackData('/ads');
  } catch (error) {
    console.error('Error fetching ads data:', error);
    return getFallbackData('/ads');
  }
};

// Fetch locations - FIXED to handle different response formats
// Fetch locations - handle object structure
export const fetchLocations = async (state = null, city = null) => {
  try {
    const params = {};
    if (state) params.state = state;
    if (city) params.city = city;
    
    const response = await api.get('/locations', { params });
    
    // Handle the object structure
    if (response && typeof response === 'object') {
      if (state && city) {
        // Return mandals for a specific city
        const mandals = response.mandals?.[city] || [];
        return Array.isArray(mandals) ? mandals : [];
      } else if (state) {
        // Return cities for a specific state
        const cities = response.cities?.[state] || [];
        return Array.isArray(cities) ? cities : [];
      } else {
        // Return all states
        const states = response.states || [];
        return Array.isArray(states) ? states : [];
      }
    }
    
    // Fallback
    return getFallbackLocations(state, city);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return getFallbackLocations(state, city);
  }
};

// Fetch categories
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    
    // Ensure response has the expected structure
    if (response && typeof response === 'object') {
      return {
        stores: response.stores || {},
        services: response.services || {}
      };
    }
    
    return getFallbackCategories();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return getFallbackCategories();
  }
};

// Fetch stores
export const fetchStores = async (filters = {}, page = 1, limit = 10) => {
  try {
    const params = { page, limit, ...filters };
    const response = await api.get('/stores', { params });
    return response || getFallbackStores(filters, page, limit);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return getFallbackStores(filters, page, limit);
  }
};

// Fetch services
export const fetchServices = async (filters = {}, page = 1, limit = 10) => {
  try {
    const params = { page, limit, ...filters };
    const response = await api.get('/services', { params });
    return response || getFallbackServices(filters, page, limit);
  } catch (error) {
    console.error('Error fetching services:', error);
    return getFallbackServices(filters, page, limit);
  }
};

// Fallback data functions
const getFallbackData = (endpoint) => {
  console.log(`Using fallback data for: ${endpoint}`);
  
  if (endpoint.includes('/about')) {
    return {
      title: "Local Stores & Services Directory",
      description: "Find local businesses organized by hierarchical location structure",
      features: [
        "State → City → Mandal → Category → Type hierarchy",
        "Separate directories for Stores and Services",
        "Advanced filtering system",
        "Cloudflare R2 storage"
      ],
      contact: "contact@localdirectory.com",
      version: "1.0.0"
    };
  }
  
  if (endpoint.includes('/ads')) {
    return [
      {
        id: 1,
        title: "Premium Business Listing",
        content: "Get your business featured",
        type: "premium"
      }
    ];
  }
  
  return null;
};

const getFallbackLocations = (state, city) => {
  console.log('Using fallback locations');
  
  if (state && city) {
    return ["Mandal 1", "Mandal 2", "Mandal 3"];
  } else if (state) {
    return ["City 1", "City 2", "City 3"];
  } else {
    return ["Telangana", "Andhra Pradesh", "Karnataka", "Maharashtra"];
  }
};

const getFallbackCategories = () => {
  console.log('Using fallback categories');
  return {
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
  };
};

const getFallbackStores = (filters, page, limit) => {
  return {
    data: [],
    pagination: {
      page,
      limit,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false
    },
    filters
  };
};

const getFallbackServices = (filters, page, limit) => {
  return {
    data: [],
    pagination: {
      page,
      limit,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false
    },
    filters
  };
};

export default api;
