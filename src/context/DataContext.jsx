import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCategories, fetchLocations } from '../utils/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

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
    try {
      setLoading(true);
      
      // Fetch full locations data
      const apiBaseUrl = import.meta.env.DEV ? 'http://localhost:8787/api' : '/api';
      const response = await fetch(`${apiBaseUrl}/locations`);
      const locationsData = await response.json();
      
      if (locationsData && typeof locationsData === 'object') {
        const formattedLocations = {
          states: Array.isArray(locationsData.states) ? locationsData.states : [],
          cities: locationsData.cities || {},
          mandals: locationsData.mandals || {}
        };
        
        setFullLocations(formattedLocations);
        setLocations(prev => ({ 
          ...prev, 
          states: formattedLocations.states 
        }));
      }
      
      // Fetch categories
      const cats = await fetchCategories();
      setCategories(cats || { stores: {}, services: {} });
      
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data');
      
      // Set fallback data
      setFullLocations({
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
      });
      
      setLocations({ 
        states: ["Telangana", "Andhra Pradesh", "Karnataka"],
        cities: [],
        mandals: []
      });
      
      setCategories({
        stores: {
          "Grocery": ["Supermarket", "Kirana Store"],
          "Electronics": ["Mobile Shop", "Computer Shop"],
          "Clothing": ["Footwear Shop", "Garment Shop"]
        },
        services: {
          "Beauty": ["Salon", "Barber Shop"],
          "Repair": ["Electrician", "Plumber"],
          "Education": ["Tution", "Coaching"]
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to get cities for a state
  const getCitiesForState = (state) => {
    return fullLocations.cities[state] || [];
  };

  // Function to get mandals for a city
  const getMandalsForCity = (city) => {
    return fullLocations.mandals[city] || [];
  };

  // Function to get categories by type
  const getCategoriesByType = (type) => {
    return categories[type] || {};
  };

  // Function to get types for a category
  const getTypesForCategory = (categoryType, category) => {
    return categories[categoryType]?.[category] || [];
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <DataContext.Provider value={{
      locations,
      fullLocations,
      categories,
      loading,
      error,
      getCitiesForState,
      getMandalsForCity,
      getCategoriesByType,
      getTypesForCategory,
      reloadData: loadData
    }}>
      {children}
    </DataContext.Provider>
  );
};
