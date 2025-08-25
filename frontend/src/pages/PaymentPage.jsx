// PaymentPage.js - Fixed version
import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentPage.css';
import API_BASE_URL from '../config/api';

const stripePromise = loadStripe('pk_test_51RZno6RBKRqXk49LQzEuTW2OkwqAAsWM2qqRjsvElpFa79Ytx0hsqluVBLWIptXiJyXlaU9jJ04Ojb5D8I6GVFZG00al5n1ByR');

const CheckoutForm = ({ booking, car, depositAmount, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPaymentError('');

    if (!stripe || !elements) {
      setPaymentError('Stripe is not loaded yet. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const { data } = await axios.post(`${API_BASE_URL}/api/payment/create-payment-intent`, {
        amount: depositAmount * 100, // Convert to cents
        bookingId: booking._id,
        metadata: {
          bookingId: booking._id,
          carModel: car.model,
          customerEmail: booking.email
        }
      });

      // Confirm payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: booking.name,
            email: booking.email,
            phone: booking.phone,
          }
        }
      });

      if (result.error) {
        setPaymentError(result.error.message);
        setIsProcessing(false);
      } else if (result.paymentIntent.status === 'succeeded') {
        // Payment successful, confirm booking with payment details
        await axios.put(`${API_BASE_URL}/api/bookings/confirm/${booking._id}`, {
          paymentIntentId: result.paymentIntent.id,
          paidAmount: depositAmount, // Add this
          paymentMethod: 'card', // Add this
          status: 'confirmed' // Add this
        });

        onPaymentSuccess(result.paymentIntent);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError(err.response?.data?.message || "Payment processing failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="card-section">
        <h3>Payment Information</h3>
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
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
        
        {paymentError && (
          <div className="error-message">
            <strong>Payment Error:</strong> {paymentError}
          </div>
        )}

        <div className="payment-security">
          <div className="security-icons">
            <span>🔒</span>
            <span>Your payment information is secure and encrypted</span>
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        className={`payment-submit-btn ${isProcessing ? 'processing' : ''}`}
        disabled={!stripe || isProcessing}
      >
        {isProcessing 
          ? 'Processing Payment...' 
          : `Pay Deposit Rs. ${depositAmount.toLocaleString()}`
        }
      </button>
    </form>
  );
};

// Rest of the PaymentPage component remains the same...
const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);

  const { booking, car, totalAmount, depositAmount } = location.state || {};

  useEffect(() => {
    if (!booking || !car) {
      navigate('/');
      return;
    }
  }, [booking, car, navigate]);

  const handlePaymentSuccess = (intent) => {
    setPaymentIntent(intent);
    setPaymentSuccess(true);
    
    setTimeout(() => {
      navigate('/booking-success', {
        state: {
          booking: booking,
          car: car,
          paymentIntent: intent
        }
      });
    }, 3000);
  };

  const calculateDays = () => {
    if (!booking) return 0;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    if (start.getTime() === end.getTime()) return 1;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  if (!booking || !car) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="error-container">
            <h2>Invalid Access</h2>
            <p>Please go through the booking process to access payment.</p>
            <button onClick={() => navigate('/')} className="back-btn">
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="payment-page">
        <div className="container">
          <div className="success-container">
            <div className="success-icon">✅</div>
            <h1>Payment Successful!</h1>
            <p>Your booking has been confirmed successfully.</p>
            <div className="success-details">
              <p><strong>Payment ID:</strong> {paymentIntent?.id}</p>
              <p><strong>Amount Paid:</strong> Rs. {depositAmount.toLocaleString()}</p>
            </div>
            <p className="redirect-message">
              Redirecting to confirmation page in a few seconds...
            </p>
            <button 
              onClick={() => navigate('/booking-success', {
                state: { booking, car, paymentIntent }
              })}
              className="continue-btn"
            >
              Continue to Confirmation
            </button>
          </div>
        </div>
      </div>
    );
  }

  const days = calculateDays();
  const isLongTerm = days >= 30;

  return (
    <div className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h1>Complete Your Payment</h1>
          <p>Secure your booking with a deposit payment</p>
        </div>

        <div className="payment-content">
          <div className="booking-summary-card">
            <h2>Booking Summary</h2>
            
            <div className="car-summary">
              <img src={car.imageUrl || car.image} alt={car.model} className="car-image-small" />
              <div className="car-details">
                <h3>{car.model}</h3>
                <p>Registration: {car.carId}</p>
              </div>
            </div>

            <div className="booking-details">
              <div className="detail-row">
                <span>Customer Name</span>
                <span>{booking.name}</span>
              </div>
              <div className="detail-row">
                <span>Email</span>
                <span>{booking.email}</span>
              </div>
              <div className="detail-row">
                <span>Phone</span>
                <span>{booking.phone}</span>
              </div>
              <div className="detail-row">
                <span>Rental Period</span>
                <span>
                  {new Date(booking.startDate).toLocaleDateString('en-GB')} - {new Date(booking.endDate).toLocaleDateString('en-GB')}
                  <br />
                  <small>({days} {days === 1 ? 'day' : 'days'})</small>
                </span>
              </div>
            </div>

            <div className="cost-breakdown">
              <h4>Cost Breakdown</h4>
              <div className="cost-item">
                <span>Vehicle Rental ({days} {days === 1 ? 'day' : 'days'})</span>
                <span>Rs. {(days * (isLongTerm ? car.longPeriodRentPerDay : car.rentPerDay)).toLocaleString()}</span>
              </div>
              
              {isLongTerm && (
                <div className="cost-item discount">
                  <span>Long-term Discount</span>
                  <span>- Rs. {((car.rentPerDay - car.longPeriodRentPerDay) * days).toLocaleString()}</span>
                </div>
              )}
              
              {booking.withDriver && (
                <div className="cost-item">
                  <span>Driver Service ({days} {days === 1 ? 'day' : 'days'})</span>
                  <span>Rs. {(2500 * days).toLocaleString()}</span>
                </div>
              )}
              
              {booking.weddingPurpose && (
                <div className="cost-item">
                  <span>Wedding Package</span>
                  <span>Rs. {car.weddingPurposeExtra?.toLocaleString()}</span>
                </div>
              )}
              
              <div className="cost-divider"></div>
              
              <div className="cost-item total">
                <span>Total Amount</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </div>
              
              <div className="cost-item deposit">
                <span>Deposit (30%)</span>
                <span>Rs. {depositAmount.toLocaleString()}</span>
              </div>
              
              <div className="cost-item balance">
                <span>Balance at Pickup</span>
                <span>Rs. {(totalAmount - depositAmount).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="payment-form-card">
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                booking={booking}
                car={car}
                depositAmount={depositAmount}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </Elements>

            <div className="payment-info">
              <h4>Important Information</h4>
              <ul>
                <li>You are paying a 30% deposit to secure your booking</li>
                <li>The remaining balance of Rs. {(totalAmount - depositAmount).toLocaleString()} is due at vehicle pickup</li>
                <li>Your booking will be confirmed immediately after successful payment</li>
                <li>A confirmation email will be sent to {booking.email}</li>
                <li>Cancellations must be made 24 hours before pickup</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="navigation-section">
          <button 
            onClick={() => navigate(-1)}
            className="back-button"
          >
            ← Back to Booking Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;