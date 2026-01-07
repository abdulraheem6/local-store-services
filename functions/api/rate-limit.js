// Save this in /functions/api/rate-limit.js
export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method === 'POST') {
    const data = await request.json();
    const { mobile } = data;
    
    // Check rate limit in D1 database
    const result = await env.DB.prepare(
      `SELECT COUNT(*) as count FROM registrations 
       WHERE mobile = ? AND created_at > datetime('now', '-30 days')`
    ).bind(mobile).first();
    
    if (result.count >= 2) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Monthly limit reached' 
        }), 
        { status: 429 }
      );
    }
    
    // Record registration
    await env.DB.prepare(
      'INSERT INTO registrations (mobile) VALUES (?)'
    ).bind(mobile).run();
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        remaining: 2 - (result.count + 1) 
      }), 
      { status: 200 }
    );
  }
  
  return new Response('Method not allowed', { status: 405 });
}
