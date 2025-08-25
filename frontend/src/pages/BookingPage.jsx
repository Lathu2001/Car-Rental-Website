// BookingPage.js - Simplified Debug Version
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingPage.css';
import API_BASE_URL from '../config/api';

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    altPhone: '',
    startDate: null,
    endDate: null,
    driver: false,
    weddingPurpose: false,
  });

  const [days, setDays] = useState(0);
  const [dateError, setDateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date
  const getTodayDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  // Get all unavailable dates as array of Date objects
  const getUnavailableDates = () => {
    const unavailableDates = [];
        
    bookedDates.forEach(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
            
      // Include all dates from start to end (inclusive)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        unavailableDates.push(new Date(d));
      }
    });
        
    return unavailableDates;
  };

  // Check if a specific date is unavailable
  const isDateUnavailable = (date) => {
    if (!date) return false;
    
    const unavailableDates = getUnavailableDates();
    return unavailableDates.some(unavailableDate => 
      unavailableDate.toDateString() === date.toDateString()
    );
  };

  // Validate if selected dates conflict with existing bookings
  const validateDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    
    const selectedStart = new Date(startDate);
    const selectedEnd = new Date(endDate);

    // Check if any date in the selected range is unavailable
    for (let d = new Date(selectedStart); d <= selectedEnd; d.setDate(d.getDate() + 1)) {
      if (isDateUnavailable(d)) {
        return false;
      }
    }
        
    return true;
  };

  // Custom day class name function for highlighting booked dates
  const getDayClassName = (date) => {
    if (isDateUnavailable(date)) {
      return 'react-datepicker__day--booked';
    }
    return '';
  };

  // Filter out booked dates from being selectable
  const filterDate = (date) => {
    return !isDateUnavailable(date);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      let debugMessages = [];
      
      debugMessages.push(`Token exists: ${!!token}`);
      
      if (token) {
        try {
          debugMessages.push('Making API call to /api/users/me...');
          
          const userResponse = await axios.get(`${API_BASE_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          debugMessages.push('API call successful');
          debugMessages.push(`Response status: ${userResponse.status}`);
          
          const userData = userResponse.data;
          debugMessages.push(`Response data: ${JSON.stringify(userData, null, 2)}`);
          
          setUser(userData);
          
          // Simple, direct auto-fill - exactly like your working version
          const autoFillData = {
            name: userData.name || userData.fullName || userData.firstName || userData.username || '',
            email: userData.email || userData.emailAddress || '',
            phone: userData.phone || userData.phoneNumber || userData.mobile || userData.contactNumber || ''
          };
          
          debugMessages.push(`Auto-fill data: ${JSON.stringify(autoFillData, null, 2)}`);
          
          // Update form data AFTER we have the data
          setFormData(prev => {
            const newData = { ...prev, ...autoFillData };
            debugMessages.push(`Final form data: ${JSON.stringify(newData, null, 2)}`);
            return newData;
          });
          
          setUserDataLoaded(true);
          debugMessages.push('User data loaded successfully');
          
        } catch (userErr) {
          debugMessages.push(`Error fetching user data: ${userErr.message}`);
          debugMessages.push(`Error response: ${JSON.stringify(userErr.response?.data || 'No response data')}`);
          debugMessages.push(`Error status: ${userErr.response?.status || 'No status'}`);
        }
      } else {
        debugMessages.push('No token found in localStorage');
      }
      
      setDebugInfo(debugMessages.join('\n'));
    };

    const fetchCarAndBookings = async () => {
      try {
        // Fetch car data
        const carResponse = await axios.get(`${API_BASE_URL}/api/cars/${carId}`);
        setCar(carResponse.data.data || carResponse.data);

        // Fetch existing bookings for this car
        const bookingsResponse = await axios.get(`${API_BASE_URL}/api/bookings/car/${carId}`);
        setBookedDates(bookingsResponse.data);
       
      } catch (err) {
        console.error("Error fetching car/booking data:", err);
        alert("Error loading car details or bookings.");
      }
    };

    const fetchAllData = async () => {
      setLoading(true);
      
      // Fetch user data first
      await fetchUserData();
      
      // Then fetch car and bookings
      await fetchCarAndBookings();
      
      setLoading(false);
    };

    fetchAllData();
  }, [carId]);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
        
    // If same day, count as 1 day
    if (s.getTime() === e.getTime()) return 1;
        
    const diffTime = Math.abs(e - s);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDateChange = (date, field) => {
    setDateError('');
    
    // Create new form data with updated date
    const newFormData = {
      ...formData,
      [field]: date
    };

    // Determine start and end dates
    const startDate = field === 'startDate' ? date : formData.startDate;
    const endDate = field === 'endDate' ? date : formData.endDate;

    // Validate dates
    if (startDate && endDate) {
      if (endDate < startDate) {
        setDateError("End date cannot be before start date.");
        return;
      }

      if (!validateDateRange(startDate, endDate)) {
        setDateError("Some dates in your selected range are unavailable. Please choose different dates.");
        return;
      }

      // Calculate days
      const d = calculateDays(startDate, endDate);
      setDays(d > 0 ? d : 0);
    } else if (startDate && !endDate) {
      setDays(0);
    }

    // Update form data
    setFormData(newFormData);
  };

  // Test button to manually trigger user data fetch
  const testUserFetch = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found');
      return;
    }
    
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert(`User data received: ${JSON.stringify(response.data, null, 2)}`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Proper rental logic: 30+ days = long term rate, less than 30 = normal rate
  const isLongTerm = days >= 30;
  const baseRentPerDay = car ? (isLongTerm ? car.longPeriodRentPerDay : car.rentPerDay) : 0;
    
  const totalAmount = car
    ? days * baseRentPerDay +
       (formData.driver ? 2500 * days : 0) +
       (formData.weddingPurpose ? car.weddingPurposeExtra : 0)
    : 0;

  const depositAmount = Math.round(totalAmount * 0.3); // 30% deposit

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.startDate || !formData.endDate) {
      alert("Please fill all required fields.");
      return;
    }

    // Validate dates
    if (new Date(formData.startDate) < getTodayDate()) {
      alert("Start date cannot be in the past.");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      alert("End date must be on or after start date.");
      return;
    }

    if (!validateDateRange(formData.startDate, formData.endDate)) {
      alert("Selected dates conflict with existing bookings. Please choose different dates.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/bookings`, {
        car: car._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        altPhone: formData.altPhone,
        startDate: formData.startDate,
        endDate: formData.endDate,
        withDriver: formData.driver,
        weddingPurpose: formData.weddingPurpose,
        totalAmount: totalAmount,
        upfrontPayment: depositAmount,
      });

      // Navigate to payment page with booking details
      navigate('/payment', {
        state: {
          booking: response.data.booking,
          car: car,
          totalAmount: totalAmount,
          depositAmount: depositAmount
        }
      });
     
    } catch (err) {
      console.error("Error creating booking:", err.response?.data || err.message);
      alert("Booking creation failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Check if form is valid for payment
  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.phone &&
      formData.startDate &&
      formData.endDate &&
      days > 0 &&
      !dateError &&
      !isSubmitting
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="error-container">
        <h2>Car not found</h2>
        <p>The requested car could not be found.</p>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="container">
                
        {/* Header */}
        <div className="header">
          <h1>Vehicle Reservation</h1>
          <p>Complete your booking details</p>
        </div>

       {/* Professional Car Information Card */}
        <div className="car-card">
          <div className="car-image">
            <img src={car.imageUrl || car.image} alt={car.model} />
          </div>
          <div className="car-info">
            <h2 className="car-title">{car.model}</h2>
                        
            {/* Professional Car Details Grid */}
            <div className="car-details-grid">
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">🏷️</span>
                  <span className="detail-label">Registration</span>
                </div>
                <div className="detail-value">{car.carId}</div>
              </div>
                            
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">💰</span>
                  <span className="detail-label">Daily Rate</span>
                </div>
                <div className="detail-value">Rs. {car.rentPerDay?.toLocaleString()}</div>
              </div>
                            
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">📅</span>
                  <span className="detail-label">Long Term Rate</span>
                </div>
                <div className="detail-value long-term">Rs. {car.longPeriodRentPerDay?.toLocaleString()}/day</div>
                <div className="detail-subtitle">30+ days</div>
              </div>
                            
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">⛽</span>
                  <span className="detail-label">Fuel Efficiency</span>
                </div>
                <div className="detail-value">{car.fuelCostPerKm|| 'N/A'} Km/l</div>
              </div>
                            
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">👥</span>
                  <span className="detail-label">Capacity</span>
                </div>
                <div className="detail-value">{car.passengerCount} Passengers</div>
              </div>
                            
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">💒</span>
                  <span className="detail-label">Wedding Service</span>
                </div>
                <div className="detail-value">+ Rs. {car.weddingPurposeExtra?.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>     

        {/* Date Error */}
        {dateError && (
          <div className="notification error">
            <strong>Date Selection Error:</strong> {dateError}
          </div>
        )}

        {/* Professional Booking Form */}
        <div className="form-container">
          <form onSubmit={handleBookingSubmit}>
                        
            {/* Personal Information */}
            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email address"
                  />
                </div>
                <div className="form-field">
                  <label>Primary Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-field">
                  <label>Alternative Phone</label>
                  <input
                    type="tel"
                    name="altPhone"
                    value={formData.altPhone}
                    onChange={handleChange}
                    placeholder="Enter alternative phone number"
                  />
                </div>
              </div>
            </div>

            {/* Rental Period */}
            <div className="form-section">
              <h3>Rental Period</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>Pick-up Date *</label>
                  <div className="date-picker-wrapper">
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) => handleDateChange(date, 'startDate')}
                      minDate={getTodayDate()}
                      filterDate={filterDate}
                      dayClassName={getDayClassName}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select pick-up date"
                      className="date-picker-input"
                      calendarClassName="custom-datepicker"
                      required
                    />
                    <div className="calendar-icon">
                      📅
                    </div>
                  </div>
                  <small className="date-helper">Booked dates are highlighted and cannot be selected</small>
                </div>
                <div className="form-field">
                  <label>Return Date *</label>
                  <div className="date-picker-wrapper">
                    <DatePicker
                      selected={formData.endDate}
                      onChange={(date) => handleDateChange(date, 'endDate')}
                      minDate={formData.startDate || getTodayDate()}
                      filterDate={filterDate}
                      dayClassName={getDayClassName}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="Select return date"
                      className="date-picker-input"
                      calendarClassName="custom-datepicker"
                      required
                    />
                    <div className="calendar-icon">
                      📅
                    </div>
                  </div>
                  <small className="date-helper">Select your return date</small>
                </div>
              </div>
              {isLongTerm && (
                <div className="long-term-notice">
                  <strong>Long-term Discount Applied:</strong> You're saving Rs. {((car.rentPerDay - car.longPeriodRentPerDay) * days).toLocaleString()} with our 30+ day rate.
                </div>
              )}
            </div>

            {/* Additional Services */}
            <div className="form-section">
              <h3>Additional Services</h3>
              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    name="driver"
                    checked={formData.driver}
                    onChange={handleChange}
                  />
                  <div className="checkbox-content">
                    <span>Professional Driver Service</span>
                    <span className="price">Rs. 2,500 per day</span>
                  </div>
                </label>
                                
                <label className="checkbox-item">
                  <input
                    type="checkbox"
                    name="weddingPurpose"
                    checked={formData.weddingPurpose}
                    onChange={handleChange}
                  />
                  <div className="checkbox-content">
                    <span>Wedding & Special Events Package</span>
                    <span className="price">Rs. {car.weddingPurposeExtra?.toLocaleString()}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Professional Booking Summary */}
            {days > 0 && (
              <div className="summary-card">
                <h3>Booking Summary</h3>
                <div className="summary-details">
                  <div className="summary-row">
                    <span>Vehicle Rental ({days} {days === 1 ? 'day' : 'days'})</span>
                    <span>Rs. {(baseRentPerDay * days).toLocaleString()}</span>
                  </div>
                  {isLongTerm && (
                    <div className="summary-row discount">
                      <span>Long-term Discount</span>
                      <span>- Rs. {((car.rentPerDay - car.longPeriodRentPerDay) * days).toLocaleString()}</span>
                    </div>
                  )}
                  {formData.driver && (
                    <div className="summary-row">
                      <span>Driver Service ({days} {days === 1 ? 'day' : 'days'})</span>
                      <span>Rs. {(2500 * days).toLocaleString()}</span>
                    </div>
                  )}
                  {formData.weddingPurpose && (
                    <div className="summary-row">
                      <span>Wedding Package</span>
                      <span>Rs. {car.weddingPurposeExtra?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total Amount</span>
                    <span>Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="summary-row deposit">
                    <span>Deposit Required (30%)</span>
                    <span>Rs. {depositAmount.toLocaleString()}</span>
                  </div>
                  <div className="summary-row balance">
                    <span>Balance at Pickup</span>
                    <span>Rs. {(totalAmount - depositAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="action-section">
              <div className="button-group">
                <button
                  type="button"
                  className="back-button"
                  onClick={() => navigate('/cars')}
                >
                  ← Back to Cars
                </button>
                
                <button
                  type="submit"
                  className={`proceed-btn ${!isFormValid() ? 'disabled' : ''}`}
                  disabled={!isFormValid()}
                >
                  {isSubmitting 
                    ? (
                      <>
                        <span className="spinner-small"></span>
                        Creating Booking...
                      </>
                    ) 
                    : days > 0 
                      ? (
                        <>
                          <span>Proceed to Payment</span>
                          <span className="amount">Rs. {depositAmount.toLocaleString()}</span>
                        </>
                      ) 
                      : 'Select Dates to Continue'
                  }
                </button>
              </div>
              
              {days > 0 && (
                <div className="payment-info">
                  <p>You will pay <strong>Rs. {depositAmount.toLocaleString()}</strong> now as deposit</p>
                  <p>Remaining <strong>Rs. {(totalAmount - depositAmount).toLocaleString()}</strong> due at vehicle pickup</p>
                </div>
                )}
            </div>
           
          </form>
        </div>
       
      </div>
    </div>
  );
};

export default BookingPage;