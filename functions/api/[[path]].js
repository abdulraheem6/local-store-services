export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace('/api/', '');
  
  // Set CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Route to specific handlers
    switch (path) {
      case 'about':
        return await handleAbout(request, env);
      case 'ads':
        return await handleAds(request, env);
      case 'locations':
        return await handleLocations(request, env);
      case 'categories':
        return await handleCategories(request, env);
      case 'stores':
        return await handleStores(request, env);
      case 'services':
        return await handleServices(request, env);
      case 'search':
        return await handleSearch(request, env);
      case 'all-stores':
        return await handleAllStores(request, env);
      case 'all-services':
        return await handleAllServices(request, env);
      default:
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// About endpoint handler
async function handleAbout(request, env) {
  try {
    const aboutData = await env.STORES_BUCKET.get('meta/about.json');
    
    if (!aboutData) {
      const defaultAbout = {
        title: "Local Stores & Services Directory",
        description: "Find local stores and services organized by location and category",
        features: [
          "Hierarchical organization (State > City > Mandal > Category > Type)",
          "Separate stores and services directories",
          "Advanced filtering and search",
          "Real-time data from Cloudflare R2",
          "Dark/Light mode toggle"
        ],
        contact: "contact@localdirectory.com",
        version: "2.0.0",
        structure: "hierarchical",
        lastUpdated: new Date().toISOString()
      };
      
      return new Response(JSON.stringify(defaultAbout), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        },
      });
    }
    
    return new Response(aboutData.body, {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch about data: ${error.message}`);
  }
}

// Ads endpoint handler
async function handleAds(request, env) {
  try {
    const adsData = await env.STORES_BUCKET.get('meta/ads.json');
    
    if (!adsData) {
      const defaultAds = [
        {
          id: 1,
          title: "List Your Business",
          content: "Get featured in our hierarchical directory",
          link: "#",
          type: "featured",
          position: "sidebar"
        },
        {
          id: 2,
          title: "Premium Placement",
          content: "Top position in search results",
          link: "#",
          type: "premium",
          position: "sidebar"
        }
      ];
      
      return new Response(JSON.stringify(defaultAds), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=1800'
        },
      });
    }
    
    return new Response(adsData.body, {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=1800'
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch ads data: ${error.message}`);
  }
}

// Get all locations (states, cities, mandals)
async function handleLocations(request, env) {
  try {
    // Try to get cached locations
    const locationsData = await env.STORES_BUCKET.get('meta/locations.json');
    
    if (locationsData) {
      return new Response(locationsData.body, {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        },
      });
    }
    
    // If not cached, build from structure
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    
    let responseData = {};
    
    if (state && city) {
      // Get mandals for a specific city
      responseData = await getMandals(env, state, city);
    } else if (state) {
      // Get cities for a specific state
      responseData = await getCities(env, state);
    } else {
      // Get all states
      responseData = await getAllStates(env);
    }
    
    return new Response(JSON.stringify(responseData), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600'
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch locations: ${error.message}`);
  }
}

//Get all categories and types for stores and services
// Updated Worker function with JSON validation
async function handleCategories(request, env) {
  try {
    const categoriesData = await env.STORES_BUCKET.get('meta/categories.json');
    
    if (!categoriesData) {
      return getDefaultCategories();
    }
    
    // Read and parse the JSON
    const dataText = await categoriesData.text();
    
    // Validate JSON before parsing
    try {
      const parsedData = JSON.parse(dataText);
      
      // Validate structure
      if (!parsedData.stores || !parsedData.services) {
        console.error('Invalid JSON structure in categories.json');
        return getDefaultCategories();
      }
      
      return new Response(JSON.stringify(parsedData), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600'
        },
      });
      
    } catch (parseError) {
      console.error('Failed to parse categories.json:', parseError);
      return getDefaultCategories();
    }
    
  } catch (error) {
    console.error('Error in handleCategories:', error);
    return getDefaultCategories();
  }
}

function getDefaultCategories() {
  // Return minimal default structure
  const defaultCategories = {
    stores: {},
    services: {}
  };
  
  return new Response(JSON.stringify(defaultCategories), {
    headers: { 
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600'
    },
  });
}

// Get all categories and types
// async function handleCategories(request, env) {
//   try {
//     console.log('handleCategories called');
    
//     // Check if bucket exists
//     if (!env.STORES_BUCKET) {
//       console.error('STORES_BUCKET is not defined in env');
//       return getDefaultCategories();
//     }
    
//     const categoriesData = await env.STORES_BUCKET.get('meta/categories.json');
    
//     if (!categoriesData) {
//       console.log('No categories.json found in bucket, returning default');
//       return getDefaultCategories();
//     }
    
//     // Try to parse the data
//     const data = await categoriesData.text();
//     let categories;
    
//     try {
//       categories = JSON.parse(data);
//     } catch (parseError) {
//       console.error('Failed to parse categories.json:', parseError);
//       return getDefaultCategories();
//     }
    
//     console.log('Successfully loaded categories from bucket');
    
//     return new Response(JSON.stringify(categories), {
//       headers: { 
//         'Content-Type': 'application/json',
//         'Cache-Control': 'public, max-age=3600',
//         'Access-Control-Allow-Origin': '*', // Add CORS if needed
//       },
//     });
    
//   } catch (error) {
//     console.error('Unhandled error in handleCategories:', error);
    
//     return new Response(JSON.stringify({
//       success: false,
//       error: 'Failed to fetch categories',
//       message: error.message,
//       timestamp: new Date().toISOString()
//     }), {
//       status: 500,
//       headers: { 
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*',
//       },
//     });
//   }
// }

// // Helper function for default categories
// function getDefaultCategories() {
//   const defaultCategories = {
//     success: true,
//     stores: {
//       Grocery: ["Supermarket", "Kirana Store", "Vegetable Shop", "Fruit Shop"],
//       Electronics: ["Mobile Shop", "Computer Shop", "Home Appliances"],
//       Clothing: ["Footwear Shop", "Garment Shop", "Boutique"],
//       Medical: ["Pharmacy", "Medical Store", "Clinic"],
//       Food: ["Restaurant", "Bakery", "Sweet Shop"],
//       Home: ["Furniture", "Hardware", "Paint Shop"]
//     },
//     services: {
//       Repair: ["Electrician", "Plumber", "Carpenter", "Mechanic"],
//       Beauty: ["Salon", "Spa", "Beauty Parlor"],
//       Education: ["Tution", "Coaching", "Training Center"],
//       Healthcare: ["Doctor", "Dentist", "Physiotherapist"],
//       Logistics: ["Courier", "Transport", "Packers & Movers"],
//       Professional: ["CA", "Lawyer", "Consultant"]
//     }
//   };
  
//   return new Response(JSON.stringify(defaultCategories), {
//     headers: { 
//       'Content-Type': 'application/json',
//       'Cache-Control': 'public, max-age=3600',
//       'Access-Control-Allow-Origin': '*',
//     },
//   });
// }

// Get all categories and types
// async function handleCategories(request, env) {
//   try {
//     const categoriesData = await env.STORES_BUCKET.get('meta/categories.json');
    
//     if (!categoriesData) {
//       const defaultCategories = {
//         stores: {
//           Grocery: ["Supermarket", "Kirana Store", "Vegetable Shop", "Fruit Shop"],
//           Electronics: ["Mobile Shop", "Computer Shop", "Home Appliances"],
//           Clothing: ["Footwear Shop", "Garment Shop", "Boutique"],
//           Medical: ["Pharmacy", "Medical Store", "Clinic"],
//           Food: ["Restaurant", "Bakery", "Sweet Shop"],
//           Home: ["Furniture", "Hardware", "Paint Shop"]
//         },
//         services: {
//           Repair: ["Electrician", "Plumber", "Carpenter", "Mechanic"],
//           Beauty: ["Salon", "Spa", "Beauty Parlor"],
//           Education: ["Tution", "Coaching", "Training Center"],
//           Healthcare: ["Doctor", "Dentist", "Physiotherapist"],
//           Logistics: ["Courier", "Transport", "Packers & Movers"],
//           Professional: ["CA", "Lawyer", "Consultant"]
//         }
//       };
      
//       return new Response(JSON.stringify(defaultCategories), {
//         headers: { 
//           'Content-Type': 'application/json',
//           'Cache-Control': 'public, max-age=3600'
//         },
//       });
//     }
    
//     return new Response(categoriesData.body, {
//       headers: { 
//         'Content-Type': 'application/json',
//         'Cache-Control': 'public, max-age=3600'
//       },
//     });
//   } catch (error) {
//     throw new Error(`Failed to fetch categories: ${error.message}`);
//   }
// }

// Get stores based on hierarchical filters
async function handleStores(request, env) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const city = searchParams.get('city');
  const mandal = searchParams.get('mandal');
  const category = searchParams.get('category');
  const type = searchParams.get('type');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  try {
    let stores = [];
    
    if (state && city && mandal && category && type) {
      // Get stores from specific hierarchical path
      const filePath = `stores/${state}/${city}/${mandal}/${category}/${type}/stores.json`;
      const storesData = await env.STORES_BUCKET.get(filePath);
      
      if (storesData) {
        stores = JSON.parse(await storesData.text());
      }
    } else if (state && city && mandal && category) {
      // Get all stores in a category (all types)
      stores = await getAllStoresInCategory(env, state, city, mandal, category);
    } else if (state && city && mandal) {
      // Get all stores in a mandal (all categories)
      stores = await getAllStoresInMandal(env, state, city, mandal);
    } else if (state && city) {
      // Get all stores in a city
      stores = await getAllStoresInCity(env, state, city);
    } else if (state) {
      // Get all stores in a state
      stores = await getAllStoresInState(env, state);
    } else {
      // Get all stores (use with caution for large datasets)
      stores = await getAllStores(env);
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStores = stores.slice(startIndex, endIndex);
    
    const response = {
      data: paginatedStores,
      pagination: {
        page,
        limit,
        total: stores.length,
        totalPages: Math.ceil(stores.length / limit),
        hasNext: endIndex < stores.length,
        hasPrev: page > 1
      },
      filters: { state, city, mandal, category, type },
      hierarchy: getHierarchyPath(state, city, mandal, category, type)
    };
    
    return new Response(JSON.stringify(response), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch stores: ${error.message}`);
  }
}

// Get services based on hierarchical filters
async function handleServices(request, env) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get('state');
  const city = searchParams.get('city');
  const mandal = searchParams.get('mandal');
  const category = searchParams.get('category');
  const type = searchParams.get('type');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  try {
    let services = [];
    
    if (state && city && mandal && category && type) {
      // Get services from specific hierarchical path
      const filePath = `services/${state}/${city}/${mandal}/${category}/${type}/services.json`;
      const servicesData = await env.STORES_BUCKET.get(filePath);
      
      if (servicesData) {
        services = JSON.parse(await servicesData.text());
      }
    } else if (state && city && mandal && category) {
      // Get all services in a category (all types)
      services = await getAllServicesInCategory(env, state, city, mandal, category);
    } else if (state && city && mandal) {
      // Get all services in a mandal (all categories)
      services = await getAllServicesInMandal(env, state, city, mandal);
    } else if (state && city) {
      // Get all services in a city
      services = await getAllServicesInCity(env, state, city);
    } else if (state) {
      // Get all services in a state
      services = await getAllServicesInState(env, state);
    } else {
      // Get all services
      services = await getAllServices(env);
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedServices = services.slice(startIndex, endIndex);
    
    const response = {
      data: paginatedServices,
      pagination: {
        page,
        limit,
        total: services.length,
        totalPages: Math.ceil(services.length / limit),
        hasNext: endIndex < services.length,
        hasPrev: page > 1
      },
      filters: { state, city, mandal, category, type },
      hierarchy: getHierarchyPath(state, city, mandal, category, type)
    };
    
    return new Response(JSON.stringify(response), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch services: ${error.message}`);
  }
}

// Search across all stores and services
async function handleSearch(request, env) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  try {
    const body = await request.json();
    const { query, categoryType = 'all', filters = {} } = body;
    
    let results = [];
    
    if (categoryType === 'stores' || categoryType === 'all') {
      const allStores = await getAllStores(env);
      results = [...results, ...allStores.map(s => ({ ...s, type: 'store' }))];
    }
    
    if (categoryType === 'services' || categoryType === 'all') {
      const allServices = await getAllServices(env);
      results = [...results, ...allServices.map(s => ({ ...s, type: 'service' }))];
    }
    
    // Apply text search
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply filters
    if (filters.state) results = results.filter(item => item.state === filters.state);
    if (filters.city) results = results.filter(item => item.city === filters.city);
    if (filters.mandal) results = results.filter(item => item.mandal === filters.mandal);
    if (filters.category) results = results.filter(item => item.category === filters.category);
    if (filters.serviceType) results = results.filter(item => item.serviceType === filters.serviceType);
    
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const response = {
      data: results.slice(startIndex, endIndex),
      pagination: {
        page,
        limit,
        total: results.length,
        totalPages: Math.ceil(results.length / limit),
        hasNext: endIndex < results.length,
        hasPrev: page > 1
      },
      categoryType,
      query
    };
    
    return new Response(JSON.stringify(response), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    throw new Error(`Search failed: ${error.message}`);
  }
}

// Get all stores (flat list for certain views)
async function handleAllStores(request, env) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  try {
    const allStores = await getAllStores(env);
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStores = allStores.slice(startIndex, endIndex);
    
    const response = {
      data: paginatedStores,
      pagination: {
        page,
        limit,
        total: allStores.length,
        totalPages: Math.ceil(allStores.length / limit),
        hasNext: endIndex < allStores.length,
        hasPrev: page > 1
      }
    };
    
    return new Response(JSON.stringify(response), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch all stores: ${error.message}`);
  }
}

// Get all services (flat list for certain views)
async function handleAllServices(request, env) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  
  try {
    const allServices = await getAllServices(env);
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedServices = allServices.slice(startIndex, endIndex);
    
    const response = {
      data: paginatedServices,
      pagination: {
        page,
        limit,
        total: allServices.length,
        totalPages: Math.ceil(allServices.length / limit),
        hasNext: endIndex < allServices.length,
        hasPrev: page > 1
      }
    };
    
    return new Response(JSON.stringify(response), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      },
    });
  } catch (error) {
    throw new Error(`Failed to fetch all services: ${error.message}`);
  }
}

// Helper functions
async function getAllStates(env) {
  // List all states from stores and services directories
  const storesList = await env.STORES_BUCKET.list({ prefix: 'stores/' });
  const servicesList = await env.STORES_BUCKET.list({ prefix: 'services/' });
  
  const states = new Set();
  
  // Extract states from stores directory
  storesList.objects.forEach(obj => {
    const parts = obj.key.split('/');
    if (parts.length > 1 && parts[0] === 'stores') {
      states.add(parts[1]);
    }
  });
  
  // Extract states from services directory
  servicesList.objects.forEach(obj => {
    const parts = obj.key.split('/');
    if (parts.length > 1 && parts[0] === 'services') {
      states.add(parts[1]);
    }
  });
  
  return Array.from(states).sort();
}

async function getCities(env, state) {
  const storesList = await env.STORES_BUCKET.list({ prefix: `stores/${state}/` });
  const servicesList = await env.STORES_BUCKET.list({ prefix: `services/${state}/` });
  
  const cities = new Set();
  
  storesList.objects.forEach(obj => {
    const parts = obj.key.split('/');
    if (parts.length > 2 && parts[1] === state) {
      cities.add(parts[2]);
    }
  });
  
  servicesList.objects.forEach(obj => {
    const parts = obj.key.split('/');
    if (parts.length > 2 && parts[1] === state) {
      cities.add(parts[2]);
    }
  });
  
  return Array.from(cities).sort();
}

async function getMandals(env, state, city) {
  const storesList = await env.STORES_BUCKET.list({ prefix: `stores/${state}/${city}/` });
  const servicesList = await env.STORES_BUCKET.list({ prefix: `services/${state}/${city}/` });
  
  const mandals = new Set();
  
  storesList.objects.forEach(obj => {
    const parts = obj.key.split('/');
    if (parts.length > 3 && parts[2] === city) {
      mandals.add(parts[3]);
    }
  });
  
  servicesList.objects.forEach(obj => {
    const parts = obj.key.split('/');
    if (parts.length > 3 && parts[2] === city) {
      mandals.add(parts[3]);
    }
  });
  
  return Array.from(mandals).sort();
}

async function getAllStoresInCategory(env, state, city, mandal, category) {
  // List all store type directories in the category
  const list = await env.STORES_BUCKET.list({ 
    prefix: `stores/${state}/${city}/${mandal}/${category}/` 
  });
  
  let allStores = [];
  
  for (const obj of list.objects) {
    if (obj.key.endsWith('/stores.json')) {
      const storesData = await env.STORES_BUCKET.get(obj.key);
      if (storesData) {
        const stores = JSON.parse(await storesData.text());
        allStores = [...allStores, ...stores];
      }
    }
  }
  
  return allStores;
}

async function getAllStoresInMandal(env, state, city, mandal) {
  const list = await env.STORES_BUCKET.list({ 
    prefix: `stores/${state}/${city}/${mandal}/` 
  });
  
  let allStores = [];
  
  for (const obj of list.objects) {
    if (obj.key.endsWith('/stores.json')) {
      const storesData = await env.STORES_BUCKET.get(obj.key);
      if (storesData) {
        const stores = JSON.parse(await storesData.text());
        allStores = [...allStores, ...stores];
      }
    }
  }
  
  return allStores;
}

async function getAllStoresInCity(env, state, city) {
  // This is expensive for large datasets - consider pagination at this level
  const list = await env.STORES_BUCKET.list({ 
    prefix: `stores/${state}/${city}/` 
  });
  
  let allStores = [];
  
  for (const obj of list.objects) {
    if (obj.key.endsWith('/stores.json')) {
      const storesData = await env.STORES_BUCKET.get(obj.key);
      if (storesData) {
        const stores = JSON.parse(await storesData.text());
        allStores = [...allStores, ...stores];
      }
    }
  }
  
  return allStores;
}

async function getAllStoresInState(env, state) {
  const list = await env.STORES_BUCKET.list({ 
    prefix: `stores/${state}/` 
  });
  
  let allStores = [];
  
  for (const obj of list.objects) {
    if (obj.key.endsWith('/stores.json')) {
      const storesData = await env.STORES_BUCKET.get(obj.key);
      if (storesData) {
        const stores = JSON.parse(await storesData.text());
        allStores = [...allStores, ...stores];
      }
    }
  }
  
  return allStores;
}

async function getAllStores(env) {
  const list = await env.STORES_BUCKET.list({ prefix: 'stores/' });
  
  let allStores = [];
  
  for (const obj of list.objects) {
    if (obj.key.endsWith('/stores.json')) {
      const storesData = await env.STORES_BUCKET.get(obj.key);
      if (storesData) {
        const stores = JSON.parse(await storesData.text());
        allStores = [...allStores, ...stores];
      }
    }
  }
  
  return allStores;
}

async function getAllServicesInCategory(env, state, city, mandal, category) {
  const list = await env.STORES_BUCKET.list({ 
    prefix: `services/${state}/${city}/${mandal}/${category}/` 
  });
  
  let allServices = [];
  
  for (const obj of list.objects) {
    if (obj.key.endsWith('/services.json')) {
      const servicesData = await env.STORES_BUCKET.get(obj.key);
      if (servicesData) {
        const services = JSON.parse(await servicesData.text());
        allServices = [...allServices, ...services];
      }
    }
  }
  
  return allServices;
}

async function getAllServicesInMandal(env, state, city, mandal) {
  const list = await env.STORES_BUCKET.list({ 
    prefix: `services/${state}/${city}/${mandal}/` 
  });
  
  let allServices = [];
  
  for (const obj of list.objects) {
    if (obj.key.endsWith('/services.json')) {
      const servicesData = await env.STORES_BUCKET.get(obj.key);
      if (servicesData) {
        const services = JSON.parse(await servicesData.text());
        allServices = [...allServices, ...services];
      }
    }
  }
  
  return allServices;
}

async function getAllServicesInCity(env, state, city) {
  const list = await env.STORES_BUCKET.list({ 
    prefix: `services/${state}/${city}/` 
  });
  
  let allServices = [];
  
  for (const obj of list.objects) {
    if (obj.key.endsWith('/services.json')) {
      const servicesData = await env.STORES_BUCKET.get(obj.key);
      if (servicesData) {
        const services = JSON.parse(await servicesData.text());
        allServices = [...allServices, ...services];
      }
    }
  }
  
  return allServices;
}

async function getAllServicesInState(env, state) {
  const list = await env.STORES_BUCKET.list({ 
    prefix: `services/${state}/` 
  });
  
  let allServices = [];
  
  for (const obj of list.objects) {
    if (obj.key.endsWith('/services.json')) {
      const servicesData = await env.STORES_BUCKET.get(obj.key);
      if (servicesData) {
        const services = JSON.parse(await servicesData.text());
        allServices = [...allServices, ...services];
      }
    }
  }
  
  return allServices;
}

async function getAllServices(env) {
  const list = await env.STORES_BUCKET.list({ prefix: 'services/' });
  
  let allServices = [];
  
  for (const obj of list.objects) {
    if (obj.key.endsWith('/services.json')) {
      const servicesData = await env.STORES_BUCKET.get(obj.key);
      if (servicesData) {
        const services = JSON.parse(await servicesData.text());
        allServices = [...allServices, ...services];
      }
    }
  }
  
  return allServices;
}

function getHierarchyPath(state, city, mandal, category, type) {
  const path = [];
  if (state) path.push({ level: 'state', value: state });
  if (city) path.push({ level: 'city', value: city });
  if (mandal) path.push({ level: 'mandal', value: mandal });
  if (category) path.push({ level: 'category', value: category });
  if (type) path.push({ level: 'type', value: type });
  return path;
}







// R2 Bucket Structure:
// text
// stores-directory-data/
// ├── meta/
// │   ├── about.json
// │   ├── ads.json
// │   └── config.json
// ├── stores/
// │   ├── Telangana/
// │   │   ├── Hyderabad/
// │   │   │   ├── Serilingampally/
// │   │   │   │   ├── Grocery/
// │   │   │   │   │   ├── Supermarket/
// │   │   │   │   │   │   └── stores.json
// │   │   │   │   │   └── Kirana/
// │   │   │   │   │       └── stores.json
// │   │   │   │   └── Electronics/
// │   │   │   │       ├── Mobile Shop/
// │   │   │   │       │   └── stores.json
// │   │   │   │       └── Computer Shop/
// │   │   │   │           └── stores.json
// │   │   │   └── Gachibowli/
// │   │   │       └── ...
// │   │   └── Warangal/
// │   │       └── ...
// │   ├── Andhra Pradesh/
// │   │   └── ...
// │   └── Karnataka/
// │       └── ...
// └── services/
//     ├── Telangana/
//     │   ├── Hyderabad/
//     │   │   ├── Serilingampally/
//     │   │   │   ├── Repair/
//     │   │   │   │   ├── Electrician/
//     │   │   │   │   │   └── services.json
//     │   │   │   │   └── Plumber/
//     │   │   │   │       └── services.json
//     │   │   │   └── Beauty/
//     │   │   │       ├── Salon/
//     │   │   │       │   └── services.json
//     │   │   │       └── Spa/
//     │   │   │           └── services.json
//     │   │   └── Gachibowli/
//     │   │       └── ...
//     │   └── Warangal/
//     │       └── ...
//     └── ...
