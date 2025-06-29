import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './BookingPage.css';

const stripePromise = loadStripe('pk_test_51RZno6RBKRqXk49LQzEuTW2OkwqAAsWM2qqRjsvElpFa79Ytx0hsqluVBLWIptXiJyXlaU9jJ04Ojb5D8I6GVFZG00al5n1ByR');

const CheckoutForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    try {
      const { data } = await axios.post('http://localhost:5000/api/payment/create-payment-intent', {
        amount: totalAmount * 100,
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent.status === 'succeeded') {
        alert("✅ Payment Successful!");
        navigate('/success');
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("❌ Payment failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-container">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
            },
          }}
        />
      </div>
      <button type="submit" className="payment-btn">
        <span>💳</span>
        Pay Rs. {totalAmount}
      </button>
    </form>
  );
};

const BookingPage = () => {
  const { carId } = useParams();
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
  });

  const [days, setDays] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [dateError, setDateError] = useState('');

  // Get tomorrow's date in YYYY-MM-DD format
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data first
        const token = localStorage.getItem('token');
        
        if (token) {
          try {
            console.log('Fetching user data with token:', token);
            const userResponse = await axios.get('http://localhost:5000/api/users/me', {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Full user response:', userResponse);
            console.log('User data received:', userResponse.data);
            
            const userData = userResponse.data;
            setUser(userData);
            
            // Auto-fill form data immediately when user data is fetched
            console.log('Auto-filling form with user data...');
            const autoFillData = {
              name: userData.name || userData.fullName || userData.firstName || userData.username || '',
              email: userData.email || userData.emailAddress || '',
              phone: userData.phone || userData.phoneNumber || userData.mobile || userData.contactNumber || ''
            };
            
            console.log('Auto-fill data:', autoFillData);
            
            setFormData(prev => ({
              ...prev,
              ...autoFillData
            }));
            
            setUserDataLoaded(true);
            
          } catch (userErr) {
            console.error('Failed to fetch user data:', userErr.response || userErr);
            // If user data fetch fails, continue without auto-fill
          }
        } else {
          console.log('No token found in localStorage');
        }

        // Fetch car data
        console.log('Fetching car data for ID:', carId);
        const carResponse = await axios.get(`http://localhost:5000/api/cars/${carId}`);
        console.log('Car response:', carResponse.data);
        setCar(carResponse.data.data || carResponse.data);

        // Fetch existing bookings for this car
        console.log('Fetching bookings for car:', carId);
        const bookingsResponse = await axios.get(`http://localhost:5000/api/bookings/car/${carId}`);
        console.log('Bookings response:', bookingsResponse.data);
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
    const diffTime = Math.abs(e - s);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDateError('');
    
    // Check if user is trying to select an unavailable date
    if ((name === 'startDate' || name === 'endDate') && value) {
      if (isDateUnavailable(value)) {
        setDateError("❌ This date is not available. Please choose a different date.");
        return;
      }
      
      // If it's end date, check if any date between start and end is unavailable
      if (name === 'endDate' && formData.startDate) {
        const start = new Date(formData.startDate);
        const end = new Date(value);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split('T')[0];
          if (isDateUnavailable(dateString)) {
            setDateError("❌ Some dates in your selected range are unavailable. Please choose different dates.");
            return;
          }
        }
      }
      
      // If it's start date, check if end date is still valid
      if (name === 'startDate' && formData.endDate) {
        const start = new Date(value);
        const end = new Date(formData.endDate);
        
        if (start > end) {
          setDateError("❌ Start date cannot be after end date.");
          return;
        }
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split('T')[0];
          if (isDateUnavailable(dateString)) {
            setDateError("❌ Some dates in your selected range are unavailable. Please choose different dates.");
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

  const totalAmount = car
    ? days * car.rentPerDay + (formData.driver ? 2500 * days : 0)
    : 0;

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.startDate || !formData.endDate) {
      alert("Please fill all required fields.");
      return;
    }

    // Validate dates
    if (new Date(formData.startDate) < new Date(getTomorrowDate())) {
      alert("Start date must be from tomorrow onwards.");
      return;
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      alert("End date must be after start date.");
      return;
    }

    if (!validateDates(formData.startDate, formData.endDate)) {
      alert("Selected dates conflict with existing bookings. Please choose different dates.");
      return;
    }

    console.log('Submitting booking with data:', {
      car: car._id,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalAmount: totalAmount
    });

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
        totalAmount: totalAmount,
      });

      console.log('Booking response:', response.data);
      setShowPayment(true);
    } catch (err) {
      console.error("Error saving booking:", err.response?.data || err.message);
      alert("Booking failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading car details...</p>
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h2>🚗 Car not found</h2>
          <p>The requested car could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Header Section */}
        <div className="booking-header">
          <h1 className="booking-title">Book Your Perfect Ride</h1>
          <p className="booking-subtitle">Complete your reservation in just a few steps</p>
        </div>

        {/* Car Details Section */}
        <div className="car-showcase">
          <div className="car-image-container">
            <img 
              src={car.imageUrl || car.image} 
              alt={car.model} 
              className="car-image"
            />
            <div className="car-overlay">
              <div className="car-badge">Premium</div>
            </div>
          </div>
          
          <div className="car-details-panel">
            <h2 className="car-model">{car.model}</h2>
            <div className="car-specs">
              <div className="spec-item">
                <div className="spec-icon">💰</div>
                <div className="spec-content">
                  <span className="spec-label">Per Day</span>
                  <span className="spec-value">Rs. {car.rentPerDay}</span>
                </div>
              </div>
              
              <div className="spec-item">
                <div className="spec-icon">⛽</div>
                <div className="spec-content">
                  <span className="spec-label">Fuel</span>
                  <span className="spec-value">{car.fuelCostPerKm} Km/l</span>
                </div>
              </div>
              
              <div className="spec-item">
                <div className="spec-icon">👥</div>
                <div className="spec-content">
                  <span className="spec-label">Capacity</span>
                  <span className="spec-value">{car.passengerCount} Passengers</span>
                </div>
              </div>
              
              <div className="spec-item">
                <div className="spec-icon">🚘</div>
                <div className="spec-content">
                  <span className="spec-label">Registration No</span>
                  <span className="spec-value">{car.carId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Info Alert */}
        {user && userDataLoaded && (
          <div className="user-info-alert">
            <div className="alert-icon">✅</div>
            <div className="alert-content">
              <strong>Information Auto-filled</strong>
              <p>Your profile information has been automatically filled. You can modify it if needed.</p>
            </div>
          </div>
        )}

        {/* Manual Auto-fill Button for Testing */}
        {user && !userDataLoaded && (
          <div className="user-info-alert" style={{backgroundColor: '#fff3cd', borderColor: '#ffeaa7'}}>
            <div className="alert-icon">ℹ️</div>
            <div className="alert-content">
              <strong>Auto-fill Available</strong>
              <p>We found your profile information. 
                <button 
                  type="button" 
                  onClick={() => {
                    const autoFillData = {
                      name: user.name || user.fullName || user.firstName || user.username || '',
                      email: user.email || user.emailAddress || '',
                      phone: user.phone || user.phoneNumber || user.mobile || user.contactNumber || ''
                    };
                    console.log('Manual auto-fill triggered:', autoFillData);
                    setFormData(prev => ({
                      ...prev,
                      ...autoFillData
                    }));
                    setUserDataLoaded(true);
                  }}
                  style={{
                    marginLeft: '10px',
                    padding: '5px 10px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Fill My Information
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Unavailable Dates Alert */}
        {bookedDates.length > 0 && (
          <div className="unavailable-dates-alert">
            <div className="alert-header">
              <div className="alert-icon">❌</div>
              <h3>Unavailable Dates</h3>
            </div>
            <div className="dates-grid">
              {bookedDates.map((booking, index) => (
                <div key={index} className="date-range">
                  {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                </div>
              ))}
            </div>
            <p className="dates-note">These dates are not available for booking</p>
          </div>
        )}

        {/* Date Error */}
        {dateError && (
          <div className="error-alert">
            <div className="alert-icon">⚠️</div>
            <p>{dateError}</p>
          </div>
        )}

        {/* Booking Form */}
        <div className="booking-form-container">
          <form onSubmit={handleConfirm} className="booking-form">
            <div className="form-section">
              <h3 className="section-title">📋 Personal Information</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label className="form-label">Alternate Phone</label>
                  <input
                    type="tel"
                    name="altPhone"
                    placeholder="Enter alternate phone number"
                    value={formData.altPhone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">📅 Rental Period</h3>
              <div className="date-grid">
                <div className="form-field">
                  <label className="form-label">Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className={`form-input date-input ${dateError ? 'error' : ''}`}
                    min={getTomorrowDate()}
                    required
                  />
                </div>
                
                <div className="form-field">
                  <label className="form-label">End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className={`form-input date-input ${dateError ? 'error' : ''}`}
                    min={formData.startDate || getTomorrowDate()}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">🚗 Additional Services</h3>
              <label className="driver-checkbox">
                <input
                  type="checkbox"
                  name="driver"
                  checked={formData.driver}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <div className="checkbox-custom"></div>
                <div className="checkbox-content">
                  <span className="checkbox-title">👨‍💼Need a Driver</span>
                  <span className="checkbox-price">+ Rs. 2500 /day</span>
                </div>
              </label>
            </div>
          </form>
        </div>

        {/* Booking Summary */}
        {days > 0 && (
          <div className="booking-summary">
            <h3 className="summary-title">💳 Booking Summary</h3>
            <div className="summary-content">
              <div className="summary-item">
                <span>Car Rental ({days} days)</span>
                <span>Rs {car.rentPerDay * days}</span>
              </div>
              {formData.driver && (
                <div className="summary-item">
                  <span>Driver Service ({days} days)</span>
                  <span>Rs. {2500 * days}</span>
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Total Amount</span>
                <span>Rs. {totalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-section">
          {!showPayment ? (
            <button
              onClick={handleConfirm}
              className={`confirm-btn ${!formData.startDate || !formData.endDate || days === 0 ? 'disabled' : ''}`}
              disabled={!formData.startDate || !formData.endDate || days === 0}
            >
              {days > 0 ? (
                <>
                  <span>🎯</span>
                  Confirm Booking (Rs .{totalAmount})
                </>
              ) : (
                <>
                  <span>📅</span>
                  Select Dates to Continue
                </>
              )}
            </button>
          ) : (
            <div className="payment-section">
              <h3 className="payment-title">💳 Complete Your Payment</h3>
              <Elements stripe={stripePromise}>
                <CheckoutForm totalAmount={totalAmount} />
              </Elements>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;