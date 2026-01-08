// import React, { useState, useEffect } from 'react';
// import { FaStore, FaUser, FaPhone, FaMapMarkerAlt, FaClock, FaTag, FaUpload, FaCheck, FaTimes } from 'react-icons/fa';
// import { rateLimitService } from '../services/rateLimitService';
// import { verificationService } from '../services/verificationService';
// import './StoreRegistrationForm.css';

// const StoreRegistrationForm = ({ onStoreAdded }) => {
//   // Form states
//   const [step, setStep] = useState(1); // 1: Mobile, 2: OTP, 3: Details
//   const [formData, setFormData] = useState({
//     mobile: '',
//     otp: '',
//     name: '',
//     description: '',
//     state: '',
//     city: '',
//     mandal: '',
//     category: '',
//     serviceType: '',
//     ownerName: '',
//     phone: '',
//     timings: '',
//     tags: '',
//     address: '',
//     email: '',
//     website: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [otpTimer, setOtpTimer] = useState(0);
//   const [verificationStatus, setVerificationStatus] = useState({
//     mobileVerified: false,
//     otpSent: false,
//     canRegister: true
//   });

//   // Categories and types
//   const categories = [
//     'Grocery', 'Electronics', 'Medical', 'Food', 'Clothing',
//     'Automobile', 'Education', 'Fitness', 'Office', 'Home',
//     'Beauty', 'Hardware', 'Stationery', 'Pharmacy', 'Restaurant'
//   ];

//   const serviceTypes = [
//     'Retail', 'Service', 'Repair', 'Custom',
//     'Healthcare', 'Education', 'Food Service', 'Rental'
//   ];

//   const states = [
//     'Telangana', 'Andhra Pradesh', 'Karnataka', 'Maharashtra',
//     'Tamil Nadu', 'Kerala', 'Delhi', 'Uttar Pradesh'
//   ];

//   // Initialize rate limit check
//   useEffect(() => {
//     if (formData.mobile && formData.mobile.length === 10) {
//       const canRegister = rateLimitService.canRegister(formData.mobile);
//       setVerificationStatus(prev => ({
//         ...prev,
//         canRegister
//       }));
//     }
//   }, [formData.mobile]);

//   // OTP timer
//   useEffect(() => {
//     let timer;
//     if (otpTimer > 0) {
//       timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [otpTimer]);

//   const validateStep1 = () => {
//     const newErrors = {};
//     const mobileRegex = /^[6-9]\d{9}$/;

//     if (!formData.mobile) {
//       newErrors.mobile = 'Mobile number is required';
//     } else if (!mobileRegex.test(formData.mobile)) {
//       newErrors.mobile = 'Please enter a valid Indian mobile number';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateStep2 = () => {
//     const newErrors = {};

//     if (!formData.otp) {
//       newErrors.otp = 'OTP is required';
//     } else if (formData.otp.length !== 6) {
//       newErrors.otp = 'OTP must be 6 digits';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const validateStep3 = () => {
//     const newErrors = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Store name is required';
//     }
//     if (!formData.ownerName.trim()) {
//       newErrors.ownerName = 'Owner name is required';
//     }
//     if (!formData.category) {
//       newErrors.category = 'Category is required';
//     }
//     if (!formData.serviceType) {
//       newErrors.serviceType = 'Service type is required';
//     }
//     if (!formData.state) {
//       newErrors.state = 'State is required';
//     }
//     if (!formData.city.trim()) {
//       newErrors.city = 'City is required';
//     }
//     if (!formData.mandal.trim()) {
//       newErrors.mandal = 'Mandal/Taluk is required';
//     }
//     if (!formData.address.trim()) {
//       newErrors.address = 'Address is required';
//     }
//     if (!formData.phone.trim()) {
//       newErrors.phone = 'Contact number is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleMobileSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateStep1()) return;

//     if (!verificationStatus.canRegister) {
//       const remaining = rateLimitService.getRemainingRegistrations(formData.mobile);
//       const history = rateLimitService.getRegistrationHistory(formData.mobile);
      
//       setErrors({
//         mobile: `You have reached the maximum registrations (${remaining + 2}) this month.`
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       const result = await verificationService.sendOTP(formData.mobile);
//       if (result.success) {
//         setVerificationStatus(prev => ({ ...prev, otpSent: true }));
//         setOtpTimer(300); // 5 minutes
//         setStep(2);
//       } else {
//         setErrors({ mobile: result.message });
//       }
//     } catch (error) {
//       setErrors({ mobile: 'Failed to send OTP. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOTPSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateStep2()) return;

//     setLoading(true);
//     try {
//       const result = verificationService.verifyOTP(formData.mobile, formData.otp);
//       if (result.success) {
//         setVerificationStatus(prev => ({ ...prev, mobileVerified: true }));
//         setStep(3);
//       } else {
//         setErrors({ otp: result.message });
//       }
//     } catch (error) {
//       setErrors({ otp: 'Verification failed. Please try again.' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateStep3()) return;

//     const newStore = {
//       id: Date.now().toString(),
//       ...formData,
//       tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
//       rating: 4.0,
//       verified: false
//     };

//     // Record the registration
//     rateLimitService.recordRegistration(formData.mobile);

//     // Store in local storage
//     const stores = JSON.parse(localStorage.getItem('user_stores') || '[]');
//     stores.push(newStore);
//     localStorage.setItem('user_stores', JSON.stringify(stores));

//     // Notify parent component
//     if (onStoreAdded) {
//       onStoreAdded(newStore);
//     }

//     // Reset form
//     setFormData({
//       mobile: '',
//       otp: '',
//       name: '',
//       description: '',
//       state: '',
//       city: '',
//       mandal: '',
//       category: '',
//       serviceType: '',
//       ownerName: '',
//       phone: '',
//       timings: '',
//       tags: '',
//       address: '',
//       email: '',
//       website: ''
//     });
    
//     setStep(1);
//     alert('Store registered successfully! It will be reviewed before appearing in the directory.');
//   };

//   const handleResendOTP = async () => {
//     if (otpTimer > 0) return;

//     setLoading(true);
//     try {
//       const result = await verificationService.sendOTP(formData.mobile);
//       if (result.success) {
//         setOtpTimer(300);
//         alert('New OTP sent successfully');
//       } else {
//         setErrors({ otp: result.message });
//       }
//     } catch (error) {
//       setErrors({ otp: 'Failed to resend OTP' });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const renderStep1 = () => (
//     <div className="registration-step">
//       <div className="step-header">
//         <div className="step-number active">1</div>
//         <h3>Mobile Verification</h3>
//       </div>
      
//       <div className="step-content">
//         <div className="verification-info">
//           <FaPhone className="verification-icon" />
//           <p>Please verify your mobile number to proceed with store registration.</p>
//           <p className="info-note">You can register up to 2 stores per month with one mobile number.</p>
//         </div>

//         <div className="form-group">
//           <label htmlFor="mobile">
//             <FaPhone /> Mobile Number *
//           </label>
//           <input
//             type="tel"
//             id="mobile"
//             name="mobile"
//             value={formData.mobile}
//             onChange={handleInputChange}
//             placeholder="Enter 10-digit mobile number"
//             maxLength="10"
//             className={errors.mobile ? 'error' : ''}
//           />
//           {errors.mobile && <span className="error-message">{errors.mobile}</span>}
//         </div>

//         {formData.mobile && verificationStatus.canRegister === false && (
//           <div className="rate-limit-warning">
//             <FaTimes />
//             <div>
//               <strong>Registration Limit Reached</strong>
//               <p>
//                 You have registered {rateLimitService.getRegistrationHistory(formData.mobile).length} store(s) this month.
//                 You can register again next month.
//               </p>
//             </div>
//           </div>
//         )}

//         {formData.mobile && verificationStatus.canRegister && (
//           <div className="rate-limit-info">
//             <FaCheck />
//             <div>
//               <strong>Registrations Available</strong>
//               <p>
//                 You can register {rateLimitService.getRemainingRegistrations(formData.mobile)} more store(s) this month.
//               </p>
//             </div>
//           </div>
//         )}

//         <div className="form-actions">
//           <button
//             type="button"
//             onClick={handleMobileSubmit}
//             disabled={loading || !formData.mobile || !verificationStatus.canRegister}
//             className="btn-primary"
//           >
//             {loading ? 'Sending OTP...' : 'Send OTP'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep2 = () => (
//     <div className="registration-step">
//       <div className="step-header">
//         <div className="step-number active">2</div>
//         <h3>Enter OTP</h3>
//       </div>
      
//       <div className="step-content">
//         <div className="verification-info">
//           <FaCheck className="verification-icon" />
//           <p>OTP sent to <strong>{formData.mobile}</strong></p>
//           {otpTimer > 0 ? (
//             <p className="timer">Time remaining: {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</p>
//           ) : (
//             <p className="timer-expired">OTP expired</p>
//           )}
//         </div>

//         <div className="form-group">
//           <label htmlFor="otp">
//             <FaCheck /> Enter 6-digit OTP *
//           </label>
//           <input
//             type="text"
//             id="otp"
//             name="otp"
//             value={formData.otp}
//             onChange={handleInputChange}
//             placeholder="Enter OTP"
//             maxLength="6"
//             className={errors.otp ? 'error' : ''}
//           />
//           {errors.otp && <span className="error-message">{errors.otp}</span>}
//         </div>

//         <div className="otp-actions">
//           <button
//             type="button"
//             onClick={handleResendOTP}
//             disabled={otpTimer > 0 || loading}
//             className="btn-secondary"
//           >
//             {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Resend OTP'}
//           </button>
//           <button
//             type="button"
//             onClick={handleOTPSubmit}
//             disabled={loading || formData.otp.length !== 6}
//             className="btn-primary"
//           >
//             {loading ? 'Verifying...' : 'Verify OTP'}
//           </button>
//         </div>

//         <div className="back-link">
//           <button
//             type="button"
//             onClick={() => setStep(1)}
//             className="btn-text"
//           >
//             ← Change Mobile Number
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   const renderStep3 = () => (
//     <div className="registration-step">
//       <div className="step-header">
//         <div className="step-number active">3</div>
//         <h3>Store Details</h3>
//       </div>
      
//       <div className="step-content">
//         <div className="verification-info verified">
//           <FaCheck className="verification-icon" />
//           <p>Mobile <strong>{formData.mobile}</strong> verified successfully</p>
//         </div>

//         <form onSubmit={handleFormSubmit}>
//           <div className="form-section">
//             <h4>Basic Information</h4>
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="name">
//                   <FaStore /> Store Name *
//                 </label>
//                 <input
//                   type="text"
//                   id="name"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   placeholder="Enter store name"
//                   className={errors.name ? 'error' : ''}
//                 />
//                 {errors.name && <span className="error-message">{errors.name}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="ownerName">
//                   <FaUser /> Owner Name *
//                 </label>
//                 <input
//                   type="text"
//                   id="ownerName"
//                   name="ownerName"
//                   value={formData.ownerName}
//                   onChange={handleInputChange}
//                   placeholder="Enter owner name"
//                   className={errors.ownerName ? 'error' : ''}
//                 />
//                 {errors.ownerName && <span className="error-message">{errors.ownerName}</span>}
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="description">Store Description</label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 placeholder="Describe your store, products, and services"
//                 rows="3"
//               />
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="category">
//                   <FaTag /> Category *
//                 </label>
//                 <select
//                   id="category"
//                   name="category"
//                   value={formData.category}
//                   onChange={handleInputChange}
//                   className={errors.category ? 'error' : ''}
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map(cat => (
//                     <option key={cat} value={cat}>{cat}</option>
//                   ))}
//                 </select>
//                 {errors.category && <span className="error-message">{errors.category}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="serviceType">Service Type *</label>
//                 <select
//                   id="serviceType"
//                   name="serviceType"
//                   value={formData.serviceType}
//                   onChange={handleInputChange}
//                   className={errors.serviceType ? 'error' : ''}
//                 >
//                   <option value="">Select Service Type</option>
//                   {serviceTypes.map(type => (
//                     <option key={type} value={type}>{type}</option>
//                   ))}
//                 </select>
//                 {errors.serviceType && <span className="error-message">{errors.serviceType}</span>}
//               </div>
//             </div>
//           </div>

//           <div className="form-section">
//             <h4>Location Details</h4>
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="state">
//                   <FaMapMarkerAlt /> State *
//                 </label>
//                 <select
//                   id="state"
//                   name="state"
//                   value={formData.state}
//                   onChange={handleInputChange}
//                   className={errors.state ? 'error' : ''}
//                 >
//                   <option value="">Select State</option>
//                   {states.map(state => (
//                     <option key={state} value={state}>{state}</option>
//                   ))}
//                 </select>
//                 {errors.state && <span className="error-message">{errors.state}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="city">City *</label>
//                 <input
//                   type="text"
//                   id="city"
//                   name="city"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   placeholder="Enter city"
//                   className={errors.city ? 'error' : ''}
//                 />
//                 {errors.city && <span className="error-message">{errors.city}</span>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="mandal">Mandal/Taluk *</label>
//                 <input
//                   type="text"
//                   id="mandal"
//                   name="mandal"
//                   value={formData.mandal}
//                   onChange={handleInputChange}
//                   placeholder="Enter mandal/taluk"
//                   className={errors.mandal ? 'error' : ''}
//                 />
//                 {errors.mandal && <span className="error-message">{errors.mandal}</span>}
//               </div>

//               <div className="form-group">
//                 <label htmlFor="phone">Contact Number *</label>
//                 <input
//                   type="tel"
//                   id="phone"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleInputChange}
//                   placeholder="Store contact number"
//                   className={errors.phone ? 'error' : ''}
//                 />
//                 {errors.phone && <span className="error-message">{errors.phone}</span>}
//               </div>
//             </div>

//             <div className="form-group">
//               <label htmlFor="address">Complete Address *</label>
//               <textarea
//                 id="address"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleInputChange}
//                 placeholder="Enter complete store address"
//                 rows="2"
//                 className={errors.address ? 'error' : ''}
//               />
//               {errors.address && <span className="error-message">{errors.address}</span>}
//             </div>
//           </div>

//           <div className="form-section">
//             <h4>Additional Information</h4>
//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="timings">
//                   <FaClock /> Operating Hours
//                 </label>
//                 <input
//                   type="text"
//                   id="timings"
//                   name="timings"
//                   value={formData.timings}
//                   onChange={handleInputChange}
//                   placeholder="e.g., 9:00 AM - 9:00 PM"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="email">Email Address</label>
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Store email address"
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label htmlFor="website">Website</label>
//                 <input
//                   type="url"
//                   id="website"
//                   name="website"
//                   value={formData.website}
//                   onChange={handleInputChange}
//                   placeholder="https://example.com"
//                 />
//               </div>

//               <div className="form-group">
//                 <label htmlFor="tags">Tags (comma separated)</label>
//                 <input
//                   type="text"
//                   id="tags"
//                   name="tags"
//                   value={formData.tags}
//                   onChange={handleInputChange}
//                   placeholder="e.g., Delivery, 24/7, Home Service"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="form-actions">
//             <button
//               type="button"
//               onClick={() => setStep(2)}
//               className="btn-secondary"
//             >
//               ← Back
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="btn-primary"
//             >
//               {loading ? 'Registering...' : 'Register Store'}
//             </button>
//           </div>

//           <div className="form-footer">
//             <p className="terms-note">
//               By registering, you agree to our Terms of Service. Your store will be reviewed 
//               and may take 24-48 hours to appear in the directory.
//             </p>
//             <p className="limit-note">
//               Remaining registrations this month: 
//               <strong> {rateLimitService.getRemainingRegistrations(formData.mobile) - 1}</strong>
//             </p>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   return (
//     <div className="registration-form">
//       <div className="registration-header">
//         <h2>Register Your Store</h2>
//         <p>Add your business to our local directory in 3 simple steps</p>
//       </div>

//       <div className="registration-steps">
//         <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
//           <span>1</span>
//           <p>Mobile Verification</p>
//         </div>
//         <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
//           <span>2</span>
//           <p>OTP Verification</p>
//         </div>
//         <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
//           <span>3</span>
//           <p>Store Details</p>
//         </div>
//       </div>

//       <div className="registration-content">
//         {step === 1 && renderStep1()}
//         {step === 2 && renderStep2()}
//         {step === 3 && renderStep3()}
//       </div>
//     </div>
//   );
// };

// export default StoreRegistrationForm;


import React, { useState, useEffect } from 'react';
import { FaStore, FaUser, FaPhone, FaMapMarkerAlt, FaClock, FaTag, FaUpload, FaCheck, FaTimes } from 'react-icons/fa';
import { rateLimitService } from '../services/rateLimitService';
import { verificationService } from '../services/verificationService';
import axios from 'axios';
import './StoreRegistrationForm.css';
import { useData } from '../context/DataContext';

const StoreRegistrationForm = ({ onStoreAdded }) => {
  // Get data from context with safe defaults
  const { 
    locations: dataLocations = { states: [], cities: [], mandals: [] }, 
    fullLocations = { states: [], cities: {}, mandals: {} }, 
    categories = { stores: {}, services: {} },
    getCitiesForState = () => [],
    getMandalsForCity = () => [],
    getServiceTypes = () => [],
    loading: dataLoading = false,
    error: dataError = null
  } = useData();

  // Form states
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mobile: '',
    otp: '',
    name: '',
    description: '',
    state: '',
    city: '',
    mandal: '',
    category: '',
    serviceType: '',
    ownerName: '',
    phone: '',
    timings: '9:00 AM - 9:00 PM',
    tags: '',
    address: '',
    email: '',
    website: '',
    categoryType: 'stores'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState({
    mobileVerified: false,
    otpSent: false,
    canRegister: true
  });

  // Local locations state derived from context with safe defaults
  const [availableLocations, setAvailableLocations] = useState({
    states: [],
    cities: [],
    mandals: []
  });

  const [typeOptions, setTypeOptions] = useState([]);

  // Show loading state if data is loading
  if (dataLoading) {
    return (
      <div className="data-loading">
        <div className="spinner"></div>
        <p>Loading registration form data...</p>
      </div>
    );
  }

  // Show error state if data failed to load
  if (dataError) {
    return (
      <div className="data-error">
        <h3>⚠️ Unable to Load Form Data</h3>
        <p>Please refresh the page or try again later.</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Refresh Page
        </button>
      </div>
    );
  }

  // Initialize with context data - run after we know data is loaded
  useEffect(() => {
    if (dataLocations?.states) {
      setAvailableLocations({
        states: dataLocations.states || [],
        cities: [],
        mandals: []
      });
    }
  }, [dataLocations]);

  // Update cities when state changes
  useEffect(() => {
    if (formData.state) {
      const citiesForState = getCitiesForState(formData.state);
      setAvailableLocations(prev => ({
        ...prev,
        cities: Array.isArray(citiesForState) ? citiesForState : [],
        mandals: []
      }));
      setFormData(prev => ({ 
        ...prev, 
        city: '', 
        mandal: '', 
        category: '', 
        serviceType: '' 
      }));
    } else {
      setAvailableLocations(prev => ({ ...prev, cities: [], mandals: [] }));
    }
  }, [formData.state, getCitiesForState]);

  // Update mandals when city changes
  useEffect(() => {
    if (formData.state && formData.city) {
      const mandalsForCity = getMandalsForCity(formData.city);
      setAvailableLocations(prev => ({
        ...prev,
        mandals: Array.isArray(mandalsForCity) ? mandalsForCity : []
      }));
      setFormData(prev => ({ 
        ...prev, 
        mandal: '', 
        category: '', 
        serviceType: '' 
      }));
    } else {
      setAvailableLocations(prev => ({ ...prev, mandals: [] }));
    }
  }, [formData.state, formData.city, getMandalsForCity]);

  // Update type options when category changes
  useEffect(() => {
    if (formData.category && categories && categories[formData.categoryType]) {
      const types = getServiceTypes(formData.categoryType, formData.category);
      setTypeOptions(Array.isArray(types) ? types : []);
      setFormData(prev => ({ 
        ...prev, 
        serviceType: types.length > 0 ? types[0] : '' 
      }));
    } else {
      setTypeOptions([]);
      setFormData(prev => ({ ...prev, serviceType: '' }));
    }
  }, [formData.category, formData.categoryType, categories, getServiceTypes]);

  // OTP timer
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  // Check rate limit
  useEffect(() => {
    if (formData.mobile && formData.mobile.length === 10) {
      const canRegister = rateLimitService.canRegister(formData.mobile);
      console.log('Printing output of canRegister', canRegister );
      setVerificationStatus(prev => ({
        ...prev,
        canRegister
      }));
    }
  }, [formData.mobile]);

  // Rest of your functions remain exactly the same...
  const validateStep1 = () => {
    const newErrors = {};
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid Indian mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.otp) {
      newErrors.otp = 'OTP is required';
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Business name is required';
    }
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }
    if (!formData.state) {
      newErrors.state = 'State is required';
    }
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    if (!formData.mandal) {
      newErrors.mandal = 'Mandal/Taluk is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.serviceType) {
      newErrors.serviceType = 'Service type is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact number is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep1()) return;

    if (!verificationStatus.canRegister) {
      //const remaining = rateLimitService.getRemainingRegistrations(formData.mobile);
      setErrors({
        mobile: `You have reached the maximum registrations 1 , Need to register more contact support.`
      });
      return;
    }

    setLoading(true);
    try {
      const result = await verificationService.sendOTP(formData.mobile);
      if (result.success) {
        setVerificationStatus(prev => ({ ...prev, otpSent: true }));
        setOtpTimer(60); // 1 minutes
        setStep(2);
      } else {
        setErrors({ mobile: result.message });
      }
    } catch (error) {
      setErrors({ mobile: 'Failed to send OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const result = verificationService.verifyOTP(formData.mobile, formData.otp);
      if (result.success) {
        setVerificationStatus(prev => ({ ...prev, mobileVerified: true }));
        setStep(3);
      } else {
        setErrors({ otp: result.message });
      }
    } catch (error) {
      setErrors({ otp: 'Verification failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setLoading(true);
    try {
      // Generate unique ID based on location and category
      const idPrefix = formData.categoryType === 'stores' ? 'store' : 'service';
      const locationSlug = formData.city.toLowerCase().replace(/\s+/g, '_');
      const mandalSlug = formData.mandal.toLowerCase().replace(/\s+/g, '_');
      const timestamp = Date.now();
      
      const newBusiness = {
        id: `${idPrefix}_${mandalSlug}_${timestamp}`,
        name: formData.name,
        description: formData.description,
        state: formData.state,
        city: formData.city,
        mandal: formData.mandal,
        category: formData.category,
        serviceType: formData.serviceType,
        phone: formData.phone,
        timings: formData.timings,
        rating: "4.0",
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        coordinates: {
          lat: 0,
          lng: 0
        },
        ownerName: formData.ownerName,
        address: formData.address,
        email: formData.email || '',
        website: formData.website || '',
        registeredMobile: formData.mobile,
        registrationDate: new Date().toISOString(),
        status: 'pending',
        verified: false
      };

      // Send to API for R2 storage
      const apiBaseUrl = import.meta.env.DEV ? 'http://localhost:8787/api' : '/api';
      const response = await axios.post(`${apiBaseUrl}/register`, {
        business: newBusiness,
        categoryType: formData.categoryType
      });

      if (response.data.success) {
        // Record the registration
        // rateLimitService.recordRegistration(formData.mobile);
        
        // Store locally for immediate display
        const userBusinesses = JSON.parse(localStorage.getItem('user_businesses') || '[]');
        userBusinesses.push(newBusiness);
        localStorage.setItem('user_businesses', JSON.stringify(userBusinesses));

        // Notify parent component
        if (onStoreAdded) {
          onStoreAdded(newBusiness);
        }

        // Reset form
        setFormData({
          mobile: '',
          otp: '',
          name: '',
          description: '',
          state: '',
          city: '',
          mandal: '',
          category: '',
          serviceType: '',
          ownerName: '',
          phone: '',
          timings: '9:00 AM - 9:00 PM',
          tags: '',
          address: '',
          email: '',
          website: '',
          categoryType: 'stores'
        });
        
        setStep(1);
        setVerificationStatus({
          mobileVerified: false,
          otpSent: false,
          canRegister: true
        });
        
        return true;
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'Failed to register business. Please try again.'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;

    setLoading(true);
    try {
      const result = await verificationService.sendOTP(formData.mobile);
      if (result.success) {
        setOtpTimer(300);
        //alert('New OTP sent successfully');
          if (result.otpForTesting) {
                alert(`New OTP sent.\nOTP: ${result.otpForTesting}`);
          } else {
                alert('New OTP sent successfully. Please check your messages.');
          }
      } else {
        setErrors({ otp: result.message });
      }
    } catch (error) {
      setErrors({ otp: 'Failed to resend OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCategoryTypeChange = (type) => {
    setFormData(prev => ({ 
      ...prev, 
      categoryType: type,
      category: '',
      serviceType: ''
    }));
    setTypeOptions([]);
  };

  // Render functions remain exactly the same...
  const renderStep1 = () => (
    <div className="registration-step">
      <div className="step-header">
        <div className="step-number active">1</div>
        <h3>Mobile Verification</h3>
      </div>
      
      <div className="step-content">
        <div className="verification-info">
          <FaPhone className="verification-icon" />
          <p>Please verify your mobile number to proceed with business registration.</p>
          <p className="info-note">You can register up to 2 businesses per month with one mobile number.</p>
        </div>

        <div className="form-group">
          <label htmlFor="mobile">
            <FaPhone /> Mobile Number *
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            placeholder="Enter 10-digit mobile number"
            maxLength="10"
            className={errors.mobile ? 'error' : ''}
          />
          {errors.mobile && <span className="error-message">{errors.mobile}</span>}
        </div>

        {formData.mobile && verificationStatus.canRegister === false && (
          <div className="rate-limit-warning">
            <FaTimes />
            <div>
              <strong>Registration Limit Reached</strong>
              <p>
                You have registered {rateLimitService.getRegistrationHistory(formData.mobile).length} business(es) this month.
                You can register again next month.
              </p>
            </div>
          </div>
        )}

        {formData.mobile && verificationStatus.canRegister && (
          <div className="rate-limit-info">
            <FaCheck />
            <div>
              <strong>Registrations Available</strong>
              <p>
                You can register only register one business want more contact support team.
              </p>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={handleMobileSubmit}
            disabled={loading || !formData.mobile || !verificationStatus.canRegister}
            className="btn-primary"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="registration-step">
      <div className="step-header">
        <div className="step-number active">2</div>
        <h3>Enter OTP</h3>
      </div>
      
      <div className="step-content">
        <div className="verification-info">
          <FaCheck className="verification-icon" />
          <p>OTP sent to <strong>{formData.mobile}</strong></p>
          {otpTimer > 0 ? (
            <p className="timer">Time remaining: {Math.floor(otpTimer / 60)}:{String(otpTimer % 60).padStart(2, '0')}</p>
          ) : (
            <p className="timer-expired">OTP expired</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="otp">
            <FaCheck /> Enter 6-digit OTP *
          </label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleInputChange}
            placeholder="Enter OTP"
            maxLength="6"
            className={errors.otp ? 'error' : ''}
          />
          {errors.otp && <span className="error-message">{errors.otp}</span>}
        </div>

        <div className="otp-actions">
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={otpTimer > 0 || loading}
            className="btn-secondary"
          >
            {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Resend OTP'}
          </button>
          <button
            type="button"
            onClick={handleOTPSubmit}
            disabled={loading || formData.otp.length !== 6}
            className="btn-primary"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>

        <div className="back-link">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="btn-text"
          >
            ← Change Mobile Number
          </button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="registration-step">
      <div className="step-header">
        <div className="step-number active">3</div>
        <h3>Business Details</h3>
      </div>
      
      <div className="step-content">
        <div className="verification-info verified">
          <FaCheck className="verification-icon" />
          <p>Mobile <strong>{formData.mobile}</strong> verified successfully</p>
        </div>

        <form onSubmit={handleFormSubmit}>
          {/* Business Type Selection */}
          <div className="form-group">
            <label>Business Type *</label>
            <div className="business-type-selector">
              <button
                type="button"
                className={`type-btn ${formData.categoryType === 'stores' ? 'active' : ''}`}
                onClick={() => handleCategoryTypeChange('stores')}
              >
                🏪 Store
              </button>
              <button
                type="button"
                className={`type-btn ${formData.categoryType === 'services' ? 'active' : ''}`}
                onClick={() => handleCategoryTypeChange('services')}
              >
                🔧 Service
              </button>
            </div>
          </div>

          <div className="form-section">
            <h4>Basic Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">
                  <FaStore /> Business Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={`Enter ${formData.categoryType === 'stores' ? 'store' : 'service'} name`}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="ownerName">
                  <FaUser /> Owner Name *
                </label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  placeholder="Enter owner name"
                  className={errors.ownerName ? 'error' : ''}
                />
                {errors.ownerName && <span className="error-message">{errors.ownerName}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your business, products, and services"
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h4>Location Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="state">
                  <FaMapMarkerAlt /> State *
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={errors.state ? 'error' : ''}
                >
                  <option value="">Select State</option>
                  {availableLocations.states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="city">City *</label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!formData.state}
                  className={errors.city ? 'error' : ''}
                >
                  <option value="">Select City</option>
                  {availableLocations.cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="mandal">Mandal/Taluk *</label>
                <select
                  id="mandal"
                  name="mandal"
                  value={formData.mandal}
                  onChange={handleInputChange}
                  disabled={!formData.city}
                  className={errors.mandal ? 'error' : ''}
                >
                  <option value="">Select Mandal</option>
                  {availableLocations.mandals.map(mandal => (
                    <option key={mandal} value={mandal}>{mandal}</option>
                  ))}
                </select>
                {errors.mandal && <span className="error-message">{errors.mandal}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Contact Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Business contact number"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Complete Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter complete business address"
                rows="2"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
          </div>

          <div className="form-section">
            <h4>Business Category</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">
                  <FaTag /> Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  disabled={!formData.mandal}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select Category</option>
                  {formData.categoryType === 'stores' 
                    ? Object.keys(categories?.stores || {}).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                    : Object.keys(categories?.services || {}).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))
                  }
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="serviceType">Type *</label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  disabled={!formData.category}
                  className={errors.serviceType ? 'error' : ''}
                >
                  <option value="">Select Type</option>
                  {typeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.serviceType && <span className="error-message">{errors.serviceType}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Additional Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="timings">
                  <FaClock /> Operating Hours
                </label>
                <input
                  type="text"
                  id="timings"
                  name="timings"
                  value={formData.timings}
                  onChange={handleInputChange}
                  placeholder="e.g., 9:00 AM - 9:00 PM"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Business email address"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags (comma separated)</label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="e.g., Delivery, 24/7, Home Service"
                />
              </div>
            </div>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-secondary"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Registering...' : 'Register Business'}
            </button>
          </div>

          <div className="form-footer">
            <p className="terms-note">
              By registering, you agree to our Terms of Service. Your business will be reviewed 
              and may take 24-48 hours to appear in the directory.
            </p>
            <p className="limit-note">
              Remaining registrations : 
              <strong> 0 for more regiatrations contact support </strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="registration-form">
      <div className="registration-header">
        <h2>Register Your {formData.categoryType === 'stores' ? 'Store' : 'Service'}</h2>
        <p>Add your business to our local directory in 3 simple steps</p>
      </div>

      <div className="registration-steps">
        <div className={`step-indicator ${step >= 1 ? 'active' : ''}`}>
          <span>1</span>
          <p>Mobile Verification</p>
        </div>
        <div className={`step-indicator ${step >= 2 ? 'active' : ''}`}>
          <span>2</span>
          <p>OTP Verification</p>
        </div>
        <div className={`step-indicator ${step >= 3 ? 'active' : ''}`}>
          <span>3</span>
          <p>Business Details</p>
        </div>
      </div>

      <div className="registration-content">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default StoreRegistrationForm;
