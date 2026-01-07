import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    console.error('useData must be used within a DataProvider');
    // Return fallback values so the app doesn't crash
    return {
      locations: { states: [], cities: [], mandals: [] },
      fullLocations: { states: [], cities: {}, mandals: {} },
      categories: { stores: {}, services: {} },
      loading: false,
      error: null,
      getCitiesForState: () => [],
      getMandalsForCity: () => [],
      getServiceTypes: () => [],
      reloadData: () => {}
    };
  }
  return context;
};

export const DataProvider = ({ children }) => {
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
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiBaseUrl = import.meta.env.DEV ? 'http://localhost:8787/api' : '/api';
      console.log('Fetching data from:', apiBaseUrl);
      
      // Load locations
      const locationsResponse = await axios.get(`${apiBaseUrl}/locations`);
      console.log('Locations response:', locationsResponse.data);
      
      if (locationsResponse.data) {
        const locationsData = locationsResponse.data;
        setFullLocations({
          states: Array.isArray(locationsData.states) ? locationsData.states : [],
          cities: locationsData.cities || {},
          mandals: locationsData.mandals || {}
        });
        setLocations({
          states: Array.isArray(locationsData.states) ? locationsData.states : [],
          cities: [],
          mandals: []
        });
      }
      
      // Load categories
      const categoriesResponse = await axios.get(`${apiBaseUrl}/categories`);
      console.log('Categories response:', categoriesResponse.data);
      
      if (categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      }
      
    } catch (err) {
      console.error('Error loading data in DataContext:', err);
      setError('Failed to load directory data');
      
      // Set comprehensive fallback data
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
          "Hyderabad": ["Serilingampally", "Kukatpally", "Madhapur", "Gachibowli", "Banjara Hills"],
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
      
      setCategories({
        stores: {
          "Grocery": ["Supermarket", "Kirana Store"],
          "Electronics": ["Mobile Shop", "Computer Shop"],
          "Clothing": ["Footwear Shop", "Garment Shop"],
          "Medical": ["Pharmacy", "Clinic"],
          "Food": ["Restaurant", "Bakery"]
        },
        services: {
          "Beauty": ["Salon", "Barber Shop", "Spa"],
          "Repair": ["Electrician", "Plumber", "AC Repair"],
          "Education": ["Tution", "Coaching", "Training Center"],
          "Automobile": ["Car Service", "Bike Repair", "Tyre Shop"],
          "Home": ["Cleaning", "Pest Control", "Painting"]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Get cities for a specific state
  const getCitiesForState = (stateName) => {
    return fullLocations.cities[stateName] || [];
  };

  // Get mandals for a specific city
  const getMandalsForCity = (cityName) => {
    return fullLocations.mandals[cityName] || [];
  };

  // Get service types for a category
  const getServiceTypes = (categoryType, category) => {
    return categories[categoryType]?.[category] || [];
  };

  // Initialize data
  useEffect(() => {
    loadData();
  }, []);

  const value = {
    // Data
    locations,
    fullLocations,
    categories,
    
    // State
    loading,
    error,
    
    // Methods
    getCitiesForState,
    getMandalsForCity,
    getServiceTypes,
    reloadData: loadData
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
