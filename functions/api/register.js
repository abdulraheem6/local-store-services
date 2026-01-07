// // Cloudflare Worker for handling registration
// export async function onRequest({ request, env }) {
//   if (request.method === 'POST') {
//     try {
//       const { business, categoryType } = await request.json();
      
//       // Validate required fields
//       const requiredFields = [
//         'name', 'state', 'city', 'mandal', 
//         'category', 'serviceType', 'phone'
//       ];
      
//       for (const field of requiredFields) {
//         if (!business[field]) {
//           return new Response(
//             JSON.stringify({ 
//               success: false, 
//               message: `Missing required field: ${field}` 
//             }), 
//             { status: 400 }
//           );
//         }
//       }
      
//       // Generate file path based on hierarchy
//       const filePath = `${categoryType}/${business.state}/${business.city}/${business.mandal}/${business.category}/${business.serviceType}/${categoryType}.json`;
      
//       // Read existing data from R2
//       let existingData = [];
//       try {
//         const existingFile = await env.R2_BUCKET.get(filePath);
//         if (existingFile) {
//           existingData = JSON.parse(await existingFile.text());
//         }
//       } catch (error) {
//         // File doesn't exist yet, that's fine
//         console.log('Creating new file:', filePath);
//       }
      
//       // Add new business to existing data
//       existingData.push(business);
      
//       // Save back to R2
//       await env.R2_BUCKET.put(
//         filePath,
//         JSON.stringify(existingData, null, 2),
//         {
//           httpMetadata: {
//             contentType: 'application/json'
//           }
//         }
//       );
      
//       return new Response(
//         JSON.stringify({ 
//           success: true, 
//           message: 'Business registered successfully',
//           filePath,
//           businessId: business.id
//         }), 
//         { 
//           status: 200,
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );
      
//     } catch (error) {
//       console.error('Registration error:', error);
//       return new Response(
//         JSON.stringify({ 
//           success: false, 
//           message: 'Registration failed: ' + error.message 
//         }), 
//         { status: 500 }
//       );
//     }
//   }
  
//   return new Response(
//     JSON.stringify({ 
//       success: false, 
//       message: 'Method not allowed' 
//     }), 
//     { status: 405 }
//   );
// }


export async function onRequest({ request, env }) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method === 'POST') {
    try {
      const { business, categoryType } = await request.json();
      
      console.log('Registration request received:', { business, categoryType });
      
      // Validate required fields
      const requiredFields = [
        'name', 'state', 'city', 'mandal', 
        'category', 'serviceType', 'phone'
      ];
      
      const missingFields = requiredFields.filter(field => !business[field]);
      
      if (missingFields.length > 0) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Missing required fields: ${missingFields.join(', ')}` 
          }), 
          { 
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          }
        );
      }
      
      // Validate category type
      if (!['stores', 'services'].includes(categoryType)) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Invalid category type. Must be "stores" or "services"' 
          }), 
          { 
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          }
        );
      }
      
      // Check if R2 bucket is available
      if (!env.R2_BUCKET) {
        console.error('R2_BUCKET is not defined in environment');
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Storage service not available. Please check configuration.' 
          }), 
          { 
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          }
        );
      }
      
      // Sanitize file names (replace spaces and special characters)
      const sanitizePath = (str) => {
        return str.replace(/[^a-zA-Z0-9]/g, '_');
      };
      
      // Generate file path based on hierarchy
      const filePath = `${categoryType}/${sanitizePath(business.state)}/${sanitizePath(business.city)}/${sanitizePath(business.mandal)}/${sanitizePath(business.category)}/${sanitizePath(business.serviceType)}/${categoryType}.json`;
      
      console.log('File path:', filePath);
      
      // Read existing data from R2
      let existingData = [];
      try {
        const existingFile = await env.R2_BUCKET.get(filePath);
        if (existingFile) {
          const fileContent = await existingFile.text();
          existingData = JSON.parse(fileContent);
          console.log('Existing data found:', existingData.length, 'items');
        } else {
          console.log('No existing file found, creating new file');
        }
      } catch (error) {
        console.error('Error reading existing file:', error);
        // If file doesn't exist or is invalid JSON, start with empty array
        existingData = [];
      }
      
      // Add new business to existing data
      existingData.push(business);
      
      console.log('Saving data to R2:', {
        filePath,
        itemsCount: existingData.length,
        newBusinessId: business.id
      });
      
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
          businessId: business.id,
          itemsCount: existingData.length
        }), 
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
      
    } catch (error) {
      console.error('Registration error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Registration failed: ' + error.message,
          error: error.toString()
        }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          }
        }
      );
    }
  }
  
  return new Response(
    JSON.stringify({ 
      success: false, 
      message: 'Method not allowed' 
    }), 
    { 
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    }
  );
}
