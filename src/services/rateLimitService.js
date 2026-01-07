class RateLimitService {
  constructor() {
    this.storageKey = 'store_registrations';
    this.maxRegistrations = 2; // Max registrations per month
    this.resetPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
  }

  // Check if user can register
  canRegister(mobileNumber) {
    const registrations = this.getRegistrations();
    const userRegistrations = registrations[mobileNumber] || [];
    
    // Remove expired registrations
    const currentTime = Date.now();
    const validRegistrations = userRegistrations.filter(
      timestamp => (currentTime - timestamp) < this.resetPeriod
    );
    
    // Update storage with valid registrations
    if (validRegistrations.length !== userRegistrations.length) {
      registrations[mobileNumber] = validRegistrations;
      this.saveRegistrations(registrations);
    }
    
    return validRegistrations.length < this.maxRegistrations;
  }

  // Record a new registration
  recordRegistration(mobileNumber) {
    const registrations = this.getRegistrations();
    
    if (!registrations[mobileNumber]) {
      registrations[mobileNumber] = [];
    }
    
    registrations[mobileNumber].push(Date.now());
    this.saveRegistrations(registrations);
  }

  // Get remaining registrations
  getRemainingRegistrations(mobileNumber) {
    const registrations = this.getRegistrations();
    const userRegistrations = registrations[mobileNumber] || [];
    const currentTime = Date.now();
    
    const validRegistrations = userRegistrations.filter(
      timestamp => (currentTime - timestamp) < this.resetPeriod
    );
    
    return this.maxRegistrations - validRegistrations.length;
  }

  // Get registration history
  getRegistrationHistory(mobileNumber) {
    const registrations = this.getRegistrations();
    const userRegistrations = registrations[mobileNumber] || [];
    
    return userRegistrations.map(timestamp => ({
      date: new Date(timestamp).toLocaleDateString(),
      time: new Date(timestamp).toLocaleTimeString(),
      timestamp
    }));
  }

  // Helper methods
  getRegistrations() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  saveRegistrations(registrations) {
    localStorage.setItem(this.storageKey, JSON.stringify(registrations));
  }

  // Clear all registrations (for testing)
  clearAll() {
    localStorage.removeItem(this.storageKey);
  }
}

export const rateLimitService = new RateLimitService();
