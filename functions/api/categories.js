// functions/api/categories.js
export async function onRequestGet(context) {
  const { request, env } = context;
  
  try {
    console.log('Categories API called from Pages Functions');
    
    // Get data from R2
    const categoriesData = await env.STORES_BUCKET.get('meta/categories.json');
    
    if (categoriesData) {
      const data = await categoriesData.json();
      console.log('Successfully loaded categories from R2');
      
      return new Response(JSON.stringify(data), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }
    
    // Return default if not found
    console.log('Categories not found in R2, returning default');
    const defaultData = {
      stores: {
        Grocery: ["Supermarket", "Kirana Store"],
        Electronics: ["Mobile Shop", "Computer Shop"]
      },
      services: {
        Repair: ["Electrician", "Plumber"],
        Beauty: ["Salon", "Spa"]
      }
    };
    
    return new Response(JSON.stringify(defaultData), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      },
    });
    
  } catch (error) {
    console.error('Error in categories API:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      stores: {},
      services: {}
    }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
  }
}
