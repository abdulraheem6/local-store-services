// Cloudflare Worker for handling registration
export async function onRequest({ request, env }) {
  if (request.method === 'POST') {
    try {
      const { business, categoryType } = await request.json();
      
      // Validate required fields
      const requiredFields = [
        'name', 'state', 'city', 'mandal', 
        'category', 'serviceType', 'phone'
      ];
      
      for (const field of requiredFields) {
        if (!business[field]) {
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: `Missing required field: ${field}` 
            }), 
            { status: 400 }
          );
        }
      }
      
      // Generate file path based on hierarchy
      const filePath = `${categoryType}/${business.state}/${business.city}/${business.mandal}/${business.category}/${business.serviceType}/${categoryType}.json`;
      
      // Read existing data from R2
      let existingData = [];
      try {
        const existingFile = await env.R2_BUCKET.get(filePath);
        if (existingFile) {
          existingData = JSON.parse(await existingFile.text());
        }
      } catch (error) {
        // File doesn't exist yet, that's fine
        console.log('Creating new file:', filePath);
      }
      
      // Add new business to existing data
      existingData.push(business);
      
      // Save back to R2
      await env.R2_BUCKET.put(
        filePath,
        JSON.stringify(existingData, null, 2),
        {
          httpMetadata: {
            contentType: 'application/json'
          }
        }
      );
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Business registered successfully',
          filePath,
          businessId: business.id
        }), 
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
    } catch (error) {
      console.error('Registration error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Registration failed: ' + error.message 
        }), 
        { status: 500 }
      );
    }
  }
  
  return new Response(
    JSON.stringify({ 
      success: false, 
      message: 'Method not allowed' 
    }), 
    { status: 405 }
  );
}
