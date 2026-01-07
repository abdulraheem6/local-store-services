class VerificationService {
  constructor() {
    this.otpStorageKey = 'mobile_otps';
    this.verifiedStorageKey = 'verified_mobiles';
    this.otpExpiryTime = 10 * 60 * 1000; // 10 minutes in milliseconds
  }

  // Generate OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP (simulated)
  async sendOTP(mobileNumber) {
    const otp = this.generateOTP();
    const otpData = {
      otp,
      expiresAt: Date.now() + this.otpExpiryTime,
      mobile: mobileNumber
    };

    // Store OTP
    const otps = this.getOTPs();
    otps[mobileNumber] = otpData;
    this.saveOTPs(otps);

    // In real implementation, integrate with SMS service like:
    // - Twilio
    // - AWS SNS
    // - Firebase
    // - MSG91

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log(`OTP for ${mobileNumber}: ${otp}`); // For testing
    return {
      success: true,
      message: `OTP sent to ${mobileNumber}`,
      otpForTesting: otp // Remove in production
    };
  }

  // Verify OTP
  verifyOTP(mobileNumber, otp) {
    const otps = this.getOTPs();
    const otpData = otps[mobileNumber];

    if (!otpData) {
      return {
        success: false,
        message: 'No OTP requested for this number'
      };
    }

    if (Date.now() > otpData.expiresAt) {
      delete otps[mobileNumber];
      this.saveOTPs(otps);
      return {
        success: false,
        message: 'OTP has expired. Please request a new one.'
      };
    }

    if (otpData.otp === otp) {
      // Mark mobile as verified
      const verified = this.getVerifiedMobiles();
      verified[mobileNumber] = Date.now();
      this.saveVerifiedMobiles(verified);

      // Clear OTP
      delete otps[mobileNumber];
      this.saveOTPs(otps);

      return {
        success: true,
        message: 'Mobile number verified successfully'
      };
    }

    return {
      success: false,
      message: 'Invalid OTP. Please try again.'
    };
  }

  // Check if mobile is verified
  isVerified(mobileNumber) {
    const verified = this.getVerifiedMobiles();
    return !!verified[mobileNumber];
  }

  // Check if OTP is requested
  hasOTP(mobileNumber) {
    const otps = this.getOTPs();
    return !!otps[mobileNumber];
  }

  // Get OTP expiry time
  getOTPExpiryTime(mobileNumber) {
    const otps = this.getOTPs();
    const otpData = otps[mobileNumber];
    if (!otpData) return null;
    return otpData.expiresAt;
  }

  // Clear verification data (for testing)
  clearVerification(mobileNumber) {
    const otps = this.getOTPs();
    const verified = this.getVerifiedMobiles();
    
    delete otps[mobileNumber];
    delete verified[mobileNumber];
    
    this.saveOTPs(otps);
    this.saveVerifiedMobiles(verified);
  }

  // Helper methods
  getOTPs() {
    const stored = localStorage.getItem(this.otpStorageKey);
    return stored ? JSON.parse(stored) : {};
  }

  saveOTPs(otps) {
    localStorage.setItem(this.otpStorageKey, JSON.stringify(otps));
  }

  getVerifiedMobiles() {
    const stored = localStorage.getItem(this.verifiedStorageKey);
    return stored ? JSON.parse(stored) : {};
  }

  saveVerifiedMobiles(verified) {
    localStorage.setItem(this.verifiedStorageKey, JSON.stringify(verified));
  }
}

export const verificationService = new VerificationService();
