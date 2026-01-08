// class RateLimitService {
//   constructor() {
//     this.storageKey = 'store_registrations';
//     this.maxRegistrations = 2; // Max registrations per month
//     this.resetPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
//     this.apiEndpoint = '/api/rate-limit'; // Your API endpoint
//   }

//   // Check if user can register
//   canRegister(mobileNumber) {
//     const registrations = this.getRegistrations();
//     const userRegistrations = registrations[mobileNumber] || [];
    
//     // Remove expired registrations
//     const currentTime = Date.now();
//     const validRegistrations = userRegistrations.filter(
//       timestamp => (currentTime - timestamp) < this.resetPeriod
//     );
    
//     // Update storage with valid registrations
//     if (validRegistrations.length !== userRegistrations.length) {
//       registrations[mobileNumber] = validRegistrations;
//       this.saveRegistrations(registrations);
//     }
    
//     return validRegistrations.length < this.maxRegistrations;
//   }

//   // Check if mobile number can register a store
//   async canRegister(mobileNumber) {
//     try {
//       const response = await fetch(this.apiEndpoint, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           mobile: mobileNumber,
//           action: 'check'
//         })
//       });

//       const data = await response.json();
//       console.log(' can the registration done :', data.canRegister);
//       // Return true only if canRegister is true
//       return data.canRegister === true;
      
//     } catch (error) {
//       console.error('Error checking registration:', error);
//       // Fallback: return true if API fails (optional - change to false if you want stricter)
//       return false;
//     }
//   }
  

//   // Record a new registration
//   recordRegistration(mobileNumber) {
//     const registrations = this.getRegistrations();
    
//     if (!registrations[mobileNumber]) {
//       registrations[mobileNumber] = [];
//     }
    
//     registrations[mobileNumber].push(Date.now());
//     this.saveRegistrations(registrations);
//   }

//   // Get remaining registrations
//   getRemainingRegistrations(mobileNumber) {
//     const registrations = this.getRegistrations();
//     const userRegistrations = registrations[mobileNumber] || [];
//     const currentTime = Date.now();
    
//     const validRegistrations = userRegistrations.filter(
//       timestamp => (currentTime - timestamp) < this.resetPeriod
//     );
    
//     return this.maxRegistrations - validRegistrations.length;
//   }

//   // Get registration history
//   getRegistrationHistory(mobileNumber) {
//     const registrations = this.getRegistrations();
//     const userRegistrations = registrations[mobileNumber] || [];
    
//     return userRegistrations.map(timestamp => ({
//       date: new Date(timestamp).toLocaleDateString(),
//       time: new Date(timestamp).toLocaleTimeString(),
//       timestamp
//     }));
//   }

//   // Helper methods
//   getRegistrations() {
//     const stored = localStorage.getItem(this.storageKey);
//     return stored ? JSON.parse(stored) : {};
//   }

//   saveRegistrations(registrations) {
//     localStorage.setItem(this.storageKey, JSON.stringify(registrations));
//   }

//   // Clear all registrations (for testing)
//   clearAll() {
//     localStorage.removeItem(this.storageKey);
//   }
// }

// export const rateLimitService = new RateLimitService();



class RateLimitService {
  constructor() {
    this.apiEndpoint = '/api/rate-limit';
  }

  // Single method that returns true/false
  async canRegister(mobileNumber) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          mobile: mobileNumber
        })
      });

      if (!response.ok) {
        // If API fails, return false to be safe
        return false;
      }

      const data = await response.json();
      
      // Return the canRegister boolean directly
      return data.canRegister === true;
      
    } catch (error) {
      console.error('API call failed:', error);
      return false; // Return false on error for safety
    }
  }
}

export const rateLimitService = new RateLimitService();
