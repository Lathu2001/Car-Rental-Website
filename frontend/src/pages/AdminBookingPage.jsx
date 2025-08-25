// AdminBookingPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingPage.css';
import API_BASE_URL from '../config/api';

const AdminBookingPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCarSelection, setShowCarSelection] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '', // Optional now
    phone: '',
    altPhone: '',
    startDate: null,
    endDate: null,
    driver: false,
    weddingPurpose: false,
    paidAmount: 0, // Track how much customer paid
    paymentMethod: 'cash', // Default to cash
    notes: '' // Admin notes
  });

  const [days, setDays] = useState(0);
  const [dateError, setDateError] = useState('');

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
      
      // Set hours to avoid timezone issues
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      // Include all dates from start to end (inclusive)
      const currentDate = new Date(start);
      while (currentDate <= end) {
        unavailableDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    console.log('Generated unavailable dates:', unavailableDates.map(d => d.toDateString()));
    return unavailableDates;
  };

  // Check if a specific date is unavailable
  const isDateUnavailable = (date) => {
    if (!date) return false;
    
    // Normalize the input date
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    const unavailableDates = getUnavailableDates();
    const isUnavailable = unavailableDates.some(unavailableDate => {
      const normalizedUnavailable = new Date(unavailableDate);
      normalizedUnavailable.setHours(0, 0, 0, 0);
      return normalizedUnavailable.getTime() === checkDate.getTime();
    });
    
    if (isUnavailable) {
      console.log('Date is unavailable:', checkDate.toDateString());
    }
    
    return isUnavailable;
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
    const unavailable = isDateUnavailable(date);
    if (unavailable) {
      console.log('Marking date as booked:', date.toDateString()); // Debug log
    }
    return unavailable ? 'react-datepicker__day--booked' : '';
  };

  // Filter out booked dates from being selectable
  const filterDate = (date) => {
    return !isDateUnavailable(date);
  };

  // Fetch all cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/cars`);
        setCars(response.data.data || response.data);
      } catch (err) {
        console.error("Error fetching cars:", err);
        alert("Error loading cars.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Fetch bookings for selected car
  useEffect(() => {
    const fetchBookings = async () => {
      if (!selectedCar) return;
      
      try {
        const response = await axios.get(`${API_BASE_URL}/api/bookings/car/${selectedCar.carId}`);
        console.log('Fetched bookings for car:', selectedCar.carId, response.data); // Debug log
        setBookedDates(response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookedDates([]);
      }
    };

    fetchBookings();
  }, [selectedCar]);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    
    // If same day, count as 1 day
    if (s.getTime() === e.getTime()) return 1;
    
    const diffTime = Math.abs(e - s);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
    
    const newFormData = {
      ...formData,
      [field]: date
    };

    const startDate = field === 'startDate' ? date : formData.startDate;
    const endDate = field === 'endDate' ? date : formData.endDate;

    if (startDate && endDate) {
      if (endDate < startDate) {
        setDateError("End date cannot be before start date.");
        return;
      }

      if (!validateDateRange(startDate, endDate)) {
        setDateError("Some dates in your selected range are unavailable. Please choose different dates.");
        return;
      }

      const d = calculateDays(startDate, endDate);
      setDays(d > 0 ? d : 0);
    } else if (startDate && !endDate) {
      setDays(0);
    }

    setFormData(newFormData);
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setShowCarSelection(false);
    // Reset form data when selecting a new car
    setFormData({
      name: '',
      email: '',
      phone: '',
      altPhone: '',
      startDate: null,
      endDate: null,
      driver: false,
      weddingPurpose: false,
      paidAmount: 0,
      paymentMethod: 'cash',
      notes: ''
    });
    setDays(0);
    setDateError('');
  };

  // Filter cars based on search term
  const filteredCars = cars.filter(car =>
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.carId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate totals
  const isLongTerm = days >= 30;
  const baseRentPerDay = selectedCar ? (isLongTerm ? selectedCar.longPeriodRentPerDay : selectedCar.rentPerDay) : 0;
  
  const totalAmount = selectedCar
    ? days * baseRentPerDay +
      (formData.driver ? 2500 * days : 0) +
      (formData.weddingPurpose ? selectedCar.weddingPurposeExtra : 0)
    : 0;

  const remainingBalance = totalAmount - formData.paidAmount;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCar) {
      alert("Please select a car first.");
      return;
    }

    if (!formData.name || !formData.phone || !formData.startDate || !formData.endDate) {
      alert("Please fill all required fields (Name, Phone, Start Date, End Date).");
      return;
    }

    if (formData.paidAmount < 0) {
      alert("Paid amount cannot be negative.");
      return;
    }

    if (formData.paidAmount > totalAmount) {
      alert("Paid amount cannot exceed total amount.");
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
      const response = await axios.post(`${API_BASE_URL}/api/admin/bookings`, {
        car: selectedCar._id,
        name: formData.name,
        email: formData.email || '', // Optional
        phone: formData.phone,
        altPhone: formData.altPhone,
        startDate: formData.startDate,
        endDate: formData.endDate,
        withDriver: formData.driver,
        weddingPurpose: formData.weddingPurpose,
        totalAmount: totalAmount,
        paidAmount: formData.paidAmount,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        status: 'confirmed' // Directly confirm admin bookings
      });

      // Redirect to admin booking success page
      navigate('/admin-booking-success', {
        state: {
          booking: response.data.booking,
          car: selectedCar,
          totalAmount: totalAmount,
          paidAmount: formData.paidAmount,
          remainingBalance: remainingBalance,
          paymentMethod: formData.paymentMethod
        }
      });
      
    } catch (err) {
      console.error("Error creating booking:", err.response?.data || err.message);
      alert("Booking creation failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>Loading cars...</p>
        </div>
      </div>
    );
  }

  // Car Selection View
  if (showCarSelection) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="header">
            <h1>Admin Car Booking</h1>
            <p>Select a car to create a new booking</p>
          </div>

          <div className="search-section">
            <h3>Search & Select Car</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Search by car model or registration number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="cars-grid">
            {filteredCars.length === 0 ? (
              <div className="no-cars-message">
                <div className="no-cars-icon">🚗</div>
                <h3>No Cars Found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            ) : (
              filteredCars.map((car) => (
                <div
                  key={car._id}
                  className="car-selection-card-modern"
                  onClick={() => handleCarSelect(car)}
                >
                  <div className="car-image-container">
                    <img src={car.imageUrl || car.image} alt={car.model} />
                    <div className="price-overlay">
                      <div className="price-main">Rs. {car.rentPerDay?.toLocaleString()}</div>
                      <div className="price-period">per day</div>
                    </div>
                  </div>
                  <div className="car-details-modern">
                    <h3 className="car-model">{car.model}</h3>
                    <div className="car-specs">
                      <div className="spec-item">
                        <span className="spec-icon">🏷️</span>
                        <span className="spec-text">{car.carId}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-icon">👥</span>
                        <span className="spec-text">{car.passengerCount} seats</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-icon">⛽</span>
                        <span className="spec-text">{car.fuelCostPerKm || 'N/A'} km/l</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-icon">📅</span>
                        <span className="spec-text">Rs. {car.longPeriodRentPerDay?.toLocaleString()}/day (30+)</span>
                      </div>
                    </div>
                    <div className="select-btn-modern">
                      <span>Select This Car</span>
                      <span className="arrow">→</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Booking Form View
  return (
    <div className="booking-page">
      <div className="container">
        <div className="header">
          <h1>Admin Car Booking</h1>
          <p>Create a new booking for cash payment</p>
        </div>

        {/* Selected Car Header */}
        <div className="selected-car-header">
          <h3>Selected Car: {selectedCar.model} ({selectedCar.carId})</h3>
          <button 
            className="change-car-btn"
            onClick={() => setShowCarSelection(true)}
          >
            Change Car
          </button>
        </div>

        {/* Car Display */}
        <div className="car-card">
          <div className="car-image">
            <img src={selectedCar.imageUrl || selectedCar.image} alt={selectedCar.model} />
          </div>
          <div className="car-info">
            <h2 className="car-title">{selectedCar.model}</h2>
            <div className="car-details-grid">
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">🏷️</span>
                  <span className="detail-label">Registration</span>
                </div>
                <div className="detail-value">{selectedCar.carId}</div>
              </div>
              
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">💰</span>
                  <span className="detail-label">Daily Rate</span>
                </div>
                <div className="detail-value">Rs. {selectedCar.rentPerDay?.toLocaleString()}</div>
              </div>
              
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">📅</span>
                  <span className="detail-label">Long Term Rate</span>
                </div>
                <div className="detail-value long-term">Rs. {selectedCar.longPeriodRentPerDay?.toLocaleString()}/day</div>
                <div className="detail-subtitle">30+ days</div>
              </div>
              
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">⛽</span>
                  <span className="detail-label">Fuel Efficiency</span>
                </div>
                <div className="detail-value">{selectedCar.fuelCostPerKm || 'N/A'} Km/l</div>
              </div>
              
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">👥</span>
                  <span className="detail-label">Capacity</span>
                </div>
                <div className="detail-value">{selectedCar.passengerCount} Passengers</div>
              </div>
              
              <div className="detail-card">
                <div className="detail-header">
                  <span className="detail-icon">💒</span>
                  <span className="detail-label">Wedding Service</span>
                </div>
                <div className="detail-value">+ Rs. {selectedCar.weddingPurposeExtra?.toLocaleString()}</div>
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

        {/* Booking Form */}
        <div className="form-container">
          <form onSubmit={handleBookingSubmit}>
            
            {/* Customer Information */}
            <div className="form-section">
              <h3>Customer Information</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>Customer Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter customer's full name"
                  />
                </div>
                <div className="form-field">
                  <label>Email Address (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter customer's email (optional)"
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
                    placeholder="Enter customer's phone number"
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
                    <div className="calendar-icon">📅</div>
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
                    <div className="calendar-icon">📅</div>
                  </div>
                  <small className="date-helper">Select return date</small>
                </div>
              </div>
              {isLongTerm && (
                <div className="long-term-notice">
                  <strong>Long-term Discount Applied:</strong> Saving Rs. {((selectedCar.rentPerDay - selectedCar.longPeriodRentPerDay) * days).toLocaleString()} with 30+ day rate.
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
                    <span className="price">Rs. {selectedCar.weddingPurposeExtra?.toLocaleString()}</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Information */}
            <div className="form-section">
              <h3>Payment Information</h3>
              <div className="form-grid">
                <div className="form-field">
                  <label>Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="form-field input"
                    style={{
                      padding: '0.75rem 1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      background: 'white'
                    }}
                  >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                    <option value="online">Online Payment</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Amount Paid (Rs.)</label>
                  <input
                    type="number"
                    name="paidAmount"
                    value={formData.paidAmount}
                    onChange={handleChange}
                    min="0"
                    max={totalAmount}
                    step="0.01"
                    placeholder="Enter amount customer paid"
                  />
                  <small className="date-helper">
                    Total: Rs. {totalAmount.toLocaleString()} | 
                    30% : Rs. {Math.round(totalAmount * 0.3).toLocaleString()} |
                    Remaining: Rs. {remainingBalance.toLocaleString()} 
                  </small>
                </div>
              </div>
              <div className="form-field">
                <label>Admin Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any special notes or instructions..."
                  style={{
                    padding: '0.75rem 1rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    minHeight: '80px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            {/* Booking Summary */}
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
                      <span>- Rs. {((selectedCar.rentPerDay - selectedCar.longPeriodRentPerDay) * days).toLocaleString()}</span>
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
                      <span>Rs. {selectedCar.weddingPurposeExtra?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="summary-divider"></div>
                  <div className="summary-row total">
                    <span>Total Amount</span>
                    <span>Rs. {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="summary-row deposit">
                    <span>Amount Paid</span>
                    <span>Rs. {formData.paidAmount.toLocaleString()}</span>
                  </div>
                  <div className="summary-row balance">
                    <span>Remaining Balance</span>
                    <span>Rs. {remainingBalance.toLocaleString()}</span>
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
                  onClick={() => setShowCarSelection(true)}
                >
                  ← Change Car
                </button>
                
                <button
                  type="submit"
                  className={`proceed-btn ${(!formData.name || !formData.phone || !formData.startDate || !formData.endDate || days <= 0 || dateError || isSubmitting) ? 'disabled' : ''}`}
                  disabled={!formData.name || !formData.phone || !formData.startDate || !formData.endDate || days <= 0 || dateError || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-small"></span>
                      Creating Booking...
                    </>
                  ) : (
                    <>
                      <span>Confirm Booking</span>
                      <span className="amount">Total: Rs. {totalAmount.toLocaleString()}</span>
                    </>
                  )}
                </button>
              </div>
              
              {days > 0 && (
                <div className="payment-info">
                  <p><strong>This booking will be confirmed immediately</strong></p>
                  <p>Customer paid: <strong>Rs. {formData.paidAmount.toLocaleString()}</strong></p>
                  <p>Remaining balance: <strong>Rs. {remainingBalance.toLocaleString()}</strong></p>
                </div>
              )}
            </div>
            
          </form>
        </div>
        
      </div>
    </div>
  );
};

export default AdminBookingPage;