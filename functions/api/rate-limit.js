// // Save this in /functions/api/rate-limit.js


// -- Simple table to store mobile numbers
// CREATE TABLE IF NOT EXISTS registrations (
//   mobile TEXT PRIMARY KEY,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );


// /functions/api/rate-limit.js
// export async function onRequest(context) {
//   const { request, env } = context;
  
//   if (request.method === 'POST') {
//     try {
//       const data = await request.json();
//       const { mobile } = data;
      
//       // Validate mobile number
//       if (!mobile || typeof mobile !== 'string') {
//         return new Response(
//           JSON.stringify({ 
//             canRegister: false,
//             message: 'Valid mobile number is required'
//           }), 
//           { status: 400 }
//         );
//       }
      
//       // Clean and format mobile number
//       const cleanMobile = mobile.replace(/\D/g, '');
      
//       // Simple validation for Indian mobile numbers
//       if (cleanMobile.length !== 10 || !/^[6-9]/.test(cleanMobile)) {
//         return new Response(
//           JSON.stringify({ 
//             canRegister: false,
//             message: 'Invalid Indian mobile number'
//           }), 
//           { status: 400 }
//         );
//       }
      
//       const formattedMobile = `+91${cleanMobile}`;
      
//       // Check if mobile exists in database
//       const existingRecord = await env.DB.prepare(
//         `SELECT mobile FROM registrations WHERE mobile = ?`
//       ).bind(formattedMobile).first();
      
//       // If mobile already exists, return false
//       if (existingRecord) {
//         return new Response(
//           JSON.stringify({ 
//             canRegister: false,
//             message: 'Mobile number already registered. Only one store per number allowed.'
//           }), 
//           { status: 200 } // 200 OK with false response
//         );
//       }
      
//       // If mobile doesn't exist, add it to database
//       const result = await env.DB.prepare(
//         'INSERT INTO registrations (mobile) VALUES (?)'
//       ).bind(formattedMobile).run();
      
//       if (result.success) {
//         return new Response(
//           JSON.stringify({ 
//             canRegister: true,
//             message: 'Registration successful'
//           }), 
//           { status: 200 }
//         );
//       } else {
//         return new Response(
//           JSON.stringify({ 
//             canRegister: false,
//             message: 'Registration failed'
//           }), 
//           { status: 500 }
//         );
//       }
      
//     } catch (error) {
//       console.error('API Error:', error);
//       return new Response(
//         JSON.stringify({ 
//           canRegister: false,
//           message: 'Internal server error'
//         }), 
//         { status: 500 }
//       );
//     }
//   }
  
//   return new Response('Method not allowed', { status: 405 });
// }

// /functions/api/rate-limit.js
export async function onRequest(context) {
  const { request, env } = context;
  
  // Log for debugging
  console.log('Database binding:', env.DB ? 'Available' : 'Not available');
  
  if (request.method === 'POST') {
    try {
      const data = await request.json();
      const { mobile, action } = data;
      
      if (!mobile || typeof mobile !== 'string') {
        return new Response(
          JSON.stringify({ 
            canRegister: false,
            message: 'Valid mobile number is required'
          }), 
          { status: 400 }
        );
      }
      
      // Clean and format mobile number
      const cleanMobile = mobile.replace(/\D/g, '');
      
      if (cleanMobile.length !== 10 || !/^[6-9]/.test(cleanMobile)) {
        return new Response(
          JSON.stringify({ 
            canRegister: false,
            message: 'Invalid Indian mobile number'
          }), 
          { status: 400 }
        );
      }
      
      const formattedMobile = `+91${cleanMobile}`;
      
      // Check if DB is available
      if (!env.DB) {
        console.error('D1 database not bound! Check wrangler.toml');
        return new Response(
          JSON.stringify({ 
            canRegister: false,
            message: 'Database connection error'
          }), 
          { status: 500 }
        );
      }
      
      try {
        // Check if mobile exists
        const existingRecord = await env.DB.prepare(
          `SELECT mobile FROM registrations WHERE mobile = ?`
        ).bind(formattedMobile).first();
        
        console.log('Database query result:', existingRecord ? 'Found' : 'Not found');

        if (!action || action === 'check') {
          return new Response(
            JSON.stringify({ 
              canRegister: !existingRecord,  
              message: existingRecord ? 'Mobile number already registered' : : 'Mobile number is available for registration'
            }), 
            { status: 200 }
          );
        }


      // If registering
      if (action === 'register') {
        if (existingRecord) {
          return new Response(
            JSON.stringify({ 
              canRegister: !existingRecord,  
              message: existingRecord ? 'Mobile number already registered for business' : : 'Mobile number is available for registration'
            }), 
            { status: 409 } // 409 Conflict
          );
        }
        if (!existingRecord) {
              // Insert new registration
              const result = await env.DB.prepare(
                'INSERT INTO registrations (mobile) VALUES (?)'
              ).bind(formattedMobile).run();
              
              console.log('Insert result:', result.success ? 'Success' : 'Failed');
              
              if (result.success) {
                return new Response(
                  JSON.stringify({ 
                    canRegister: false,
                    message: 'Registration successful'
                  }), 
                  { status: 200 }
                );
              } else {
                return new Response(
                  JSON.stringify({ 
                    canRegister: true,
                    message: 'Registration failed'
                  }), 
                  { status: 500 }
                );
              }
        }
      }
         
               
      } catch (dbError) {
        console.error('Database error:', dbError);
        return new Response(
          JSON.stringify({ 
            canRegister: false,
            message: 'Database error occurred'
          }), 
          { status: 500 }
        );
      }
      
    } catch (error) {
      console.error('API Error:', error);
      return new Response(
        JSON.stringify({ 
          canRegister: false,
          message: 'Internal server error'
        }), 
        { status: 500 }
      );
    }
  }
  
  return new Response(
    JSON.stringify({ 
      canRegister: false,
      message: 'Method not allowed'
    }), 
    { status: 405 }
  );
}
