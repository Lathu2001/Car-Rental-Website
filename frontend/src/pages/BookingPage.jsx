// BookingPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './BookingPage.css';

const BookingPage = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    altPhone: '',
    startDate: '',
    endDate: '',
    driver: false,
    weddingPurpose: false,
  });

  const [days, setDays] = useState(0);
  const [dateError, setDateError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get all unavailable dates as array of date strings
  const getUnavailableDates = () => {
    const unavailableDates = [];
        
    bookedDates.forEach(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
            
      // Include all dates from start to end (inclusive)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        unavailableDates.push(d.toISOString().split('T')[0]);
      }
    });
        
    return unavailableDates;
  };

  // Check if a specific date is unavailable
  const isDateUnavailable = (dateString) => {
    const unavailableDates = getUnavailableDates();
    return unavailableDates.includes(dateString);
  };

  // Validate if selected dates conflict with existing bookings
  const validateDates = (startDate, endDate) => {
    const selectedStart = new Date(startDate);
    const selectedEnd = new Date(endDate);

    // Check if any date in the selected range is unavailable
    for (let d = new Date(selectedStart); d <= selectedEnd; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      if (isDateUnavailable(dateString)) {
        return false;
      }
    }
        
    return true;
  };

  // Inject CSS to highlight booked dates in calendar
  useEffect(() => {
    const unavailableDates = getUnavailableDates();
    
    // Create CSS to disable unavailable dates
    let dateStyles = `
      /* Highlight booked/unavailable dates */
    `;
    
    unavailableDates.forEach(date => {
      const [year, month, day] = date.split('-');
      dateStyles += `
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: none;
        }
        
        /* This targets the date input when the unavailable date would be shown */
        input[type="date"][min]:invalid {
          background-color: #fee2e2;
          border-color: #fca5a5;
        }
      `;
    });

    // Create style element
    const styleElement = document.createElement('style');
    styleElement.textContent = dateStyles;
    document.head.appendChild(styleElement);

    return () => {
      // Cleanup
      if (document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, [bookedDates]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data first
        const token = localStorage.getItem('token');
                
        if (token) {
          try {
            const userResponse = await axios.get('http://localhost:5000/api/users/me', {
              headers: { Authorization: `Bearer ${token}` }
            });
                        
            const userData = userResponse.data;
            setUser(userData);
                        
            // Auto-fill form data
            const autoFillData = {
              name: userData.name || userData.fullName || userData.firstName || userData.username || '',
              email: userData.email || userData.emailAddress || '',
              phone: userData.phone || userData.phoneNumber || userData.mobile || userData.contactNumber || ''
            };
                        
            setFormData(prev => ({
              ...prev,
              ...autoFillData
            }));
                        
            setUserDataLoaded(true);
                      
          } catch (userErr) {
            console.error('Failed to fetch user data:', userErr.response || userErr);
          }
        }

        // Fetch car data
        const carResponse = await axios.get(`http://localhost:5000/api/cars/${carId}`);
        setCar(carResponse.data.data || carResponse.data);

        // Fetch existing bookings for this car
        const bookingsResponse = await axios.get(`http://localhost:5000/api/bookings/car/${carId}`);
        setBookedDates(bookingsResponse.data);
       
      } catch (err) {
        console.error("Error fetching data:", err.response || err);
        alert("Error loading car details or bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    setDateError('');
        
    // Check if user is trying to select an unavailable date
    if ((name === 'startDate' || name === 'endDate') && value) {
      if (isDateUnavailable(value)) {
        setDateError("This date is not available. Please choose a different date.");
        return;
      }
            
      // If it's end date, check if any date between start and end is unavailable
      if (name === 'endDate' && formData.startDate) {
        const start = new Date(formData.startDate);
        const end = new Date(value);
                
        if (end < start) {
          setDateError("End date cannot be before start date.");
          return;
        }
                
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split('T')[0];
          if (isDateUnavailable(dateString)) {
            setDateError("Some dates in your selected range are unavailable. Please choose different dates.");
            return;
          }
        }
      }
            
      // If it's start date, check if end date is still valid
      if (name === 'startDate' && formData.endDate) {
        const start = new Date(value);
        const end = new Date(formData.endDate);
                
        if (start > end) {
          setDateError("Start date cannot be after end date.");
          return;
        }
                
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split('T')[0];
          if (isDateUnavailable(dateString)) {
            setDateError("Some dates in your selected range are unavailable. Please choose different dates.");
            return;
          }
        }
      }
    }
        
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'startDate' || name === 'endDate') {
      const startDate = name === 'startDate' ? value : formData.startDate;
      const endDate = name === 'endDate' ? value : formData.endDate;
            
      if (startDate && endDate) {
        const d = calculateDays(startDate, endDate);
        setDays(d > 0 ? d : 0);
      }
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
    if (new Date(formData.startDate) < new Date(getTodayDate())) {
      alert("Start date cannot be in the past.");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      alert("End date must be on or after start date.");
      return;
    }

    if (!validateDates(formData.startDate, formData.endDate)) {
      alert("Selected dates conflict with existing bookings. Please choose different dates.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/bookings', {
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
                <div className="detail-value">{car.fuelEfficiency || 'N/A'}</div>
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

        {/* Auto-fill notification */}
        {user && userDataLoaded && (
          <div className="notification success">
            <strong>Information Auto-Filled:</strong> Your profile details have been automatically populated.
          </div>
        )}

        {/* Unavailable dates */}
        {bookedDates.length > 0 && (
          <div className="notification warning">
            <h4>Unavailable Dates</h4>
            <p>The following dates are already booked and unavailable for selection:</p>
            <div className="unavailable-dates">
              {bookedDates.map((booking, index) => (
                <span key={index} className="date-range">
                  {new Date(booking.startDate).toLocaleDateString('en-GB')} - {new Date(booking.endDate).toLocaleDateString('en-GB')}
                </span>
              ))}
            </div>
          </div>
        )}

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
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    min={getTodayDate()}
                    required
                    className="date-input"
                  />
                  <small className="date-helper">Unavailable dates are highlighted in the calendar</small>
                </div>
                <div className="form-field">
                  <label>Return Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || getTodayDate()}
                    required
                    className="date-input"
                  />
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
                  onClick={() => navigate('/user-dashboard')}
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