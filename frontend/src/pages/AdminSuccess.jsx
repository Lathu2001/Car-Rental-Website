// src/pages/Success.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSuccessPage.css";
import API_BASE_URL from '../config/api';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  // These are passed from PaymentPage navigate('/booking-success', { state: { booking, car, paymentIntent } })
  const { booking, car, paymentIntent } = location.state || {};

  useEffect(() => {
    if (!booking || !car) {
      navigate("/");
    }
  }, [booking, car, navigate]);

  if (!booking || !car) {
    return (
      <div className="booking-success-page">
        <div className="container">
          <div className="error-container">
            <h2>Invalid Access</h2>
            <p>No booking information found.</p>
            <button onClick={() => navigate("/")} className="home-btn">
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helpers
  const calculateDays = () => {
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    if (start.getTime() === end.getTime()) return 1;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  };

  const days = calculateDays();
  const isLongTerm = days >= 30;

  // ✅ Always compute 30% deposit and balance locally (don’t trust booking.upfrontPayment if it’s missing/0)
  const advancePayment =
    typeof booking.upfrontPayment === "number" && booking.upfrontPayment > 0
      ? Math.round(booking.upfrontPayment)
      : Math.round(booking.totalAmount * 0.3);

  const balanceDue = booking.totalAmount - advancePayment;

  // Keep your HTML invoice generator (no external libs required)
  const downloadBookingPDF = () => {
    const pdfContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Car Rental Invoice - ${booking._id}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin:0; padding:0; color:#333; line-height:1.4; background:white; }
            .document-container { max-width:800px; margin:0 auto; padding:30px; background:white; }
            .header { display:flex; align-items:center; justify-content:space-between; padding-bottom:25px; margin-bottom:30px; border-bottom:3px solid #2c5aa0; }
            .logo-section { display:flex; align-items:center; }
            .logo { width:80px; height:80px; background:#2c5aa0; border-radius:12px; display:flex; align-items:center; justify-content:center; margin-right:20px; color:white; font-size:24px; font-weight:bold; }
            .company-name { font-size:28px; font-weight:bold; color:#2c5aa0; margin:0; letter-spacing:1px; }
            .company-tagline { font-size:14px; color:#666; margin:5px 0; font-style:italic; }
            .contact-info { font-size:12px; color:#555; line-height:1.3; }
            .document-title { text-align:right; color:#2c5aa0; }
            .document-title h1 { font-size:24px; margin:0; font-weight:bold; }
            .document-title h2 { font-size:16px; color:#666; margin:5px 0; font-weight:normal; }
            .invoice-details { display:flex; justify-content:space-between; margin-bottom:30px; background:#f8f9fa; padding:20px; border-radius:8px; }
            .invoice-info h3, .customer-info h3 { color:#2c5aa0; font-size:16px; margin:0 0 15px 0; border-bottom:2px solid #2c5aa0; padding-bottom:5px; }
            .info-line { margin:8px 0; font-size:14px; }
            .service-table { width:100%; border-collapse:collapse; margin:30px 0; background:white; box-shadow:0 2px 4px rgba(0,0,0,0.1); border-radius:8px; overflow:hidden; }
            .service-table thead { background:#2c5aa0; color:white; }
            .service-table th, .service-table td { padding:15px; text-align:left; border-bottom:1px solid #eee; }
            .service-table .amount { text-align:right; font-weight:600; }
            .vehicle-image { width:60px; height:40px; background:#f0f0f0; border-radius:4px; display:flex; align-items:center; justify-content:center; font-size:12px; color:#666; }
            .payment-summary { margin:30px 0; background:#f8f9fa; border-radius:8px; overflow:hidden; }
            .payment-summary h3 { background:#2c5aa0; color:white; margin:0; padding:15px 20px; font-size:16px; }
            .payment-content { padding:20px; }
            .payment-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #e9ecef; font-size:14px; }
            .payment-row.total { font-size:18px; font-weight:bold; color:#2c5aa0; padding-top:15px; border-top:2px solid #2c5aa0; }
            .payment-status { display:inline-block; padding:6px 12px; background:#28a745; color:white; border-radius:20px; font-size:12px; font-weight:600; }
            .terms-section { margin:30px 0; background:#fff9c4; border:1px solid #ffc107; border-radius:8px; padding:20px; }
            .terms-list { list-style:none; padding:0; margin:0; }
            .terms-list li { margin:10px 0; padding:8px 0; font-size:13px; line-height:1.4; border-bottom:1px solid #f0f0f0; }
            .footer { margin-top:40px; padding-top:20px; border-top:2px solid #2c5aa0; text-align:center; color:#666; font-size:12px; }
            @media print { .document-container { max-width:none; padding:20px; } }
          </style>
        </head>
        <body>
          <div class="document-container">
            <div class="header">
              <div class="logo-section">
                <div class="logo">IG</div>
                <div class="company-info">
                  <h1 class="company-name">ISGA HOLDING</h1>
                  <p class="company-tagline">Premium Car Rental Services</p>
                  <div class="contact-info">
                    📍 No. 123, Main Street, Colombo 07, Sri Lanka<br>
                    📞 +94 11 234 5678 | 📧 isgaholding@gmail.com<br>
                    🌐 www.isga.lk
                  </div>
                </div>
              </div>
              <div class="document-title">
                <h1>CAR RENTAL INVOICE</h1>
                <h2>Booking Confirmation</h2>
              </div>
            </div>

            <div class="invoice-details">
              <div class="invoice-info">
                <h3>📋 Invoice Details</h3>
                <div class="info-line"><strong>Invoice No:</strong> INV-${booking._id.slice(-8).toUpperCase()}</div>
                <div class="info-line"><strong>Booking ID:</strong> ${booking._id}</div>
                ${paymentIntent ? `<div class="info-line"><strong>Payment ID:</strong> ${paymentIntent.id}</div>` : ""}
                <div class="info-line"><strong>Issue Date:</strong> ${new Date().toLocaleDateString("en-GB")}</div>
                <div class="info-line"><strong>Due Date:</strong> ${new Date(booking.startDate).toLocaleDateString("en-GB")}</div>
              </div>
              <div class="customer-info">
                <h3>👤 Customer Information</h3>
                <div class="info-line"><strong>Name:</strong> ${booking.name}</div>
                <div class="info-line"><strong>Email:</strong> ${booking.email}</div>
                <div class="info-line"><strong>Phone:</strong> ${booking.phone}</div>
                ${booking.altPhone ? `<div class="info-line"><strong>Alt Phone:</strong> ${booking.altPhone}</div>` : ""}
                <div class="info-line"><strong>Booking Date:</strong> ${new Date(booking.createdAt).toLocaleDateString("en-GB")}</div>
              </div>
            </div>

            <table class="service-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Service Period</th>
                  <th>Duration</th>
                  <th>Rate/Day</th>
                  <th class="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style="display:flex; align-items:center;">
                      <div class="vehicle-image">🚗</div>
                      <div style="margin-left:10px;">
                        <strong>${car.model}</strong><br>
                        <small>Reg: ${car.carId}</small><br>
                        <small>${car.passengerCount} Passengers</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <strong>Pick-up:</strong> ${new Date(booking.startDate).toLocaleDateString("en-GB")}<br>
                    <strong>Return:</strong> ${new Date(booking.endDate).toLocaleDateString("en-GB")}
                  </td>
                  <td>
                    <strong>${days}</strong> ${days === 1 ? "Day" : "Days"}
                    ${isLongTerm ? '<br><small style="color:#28a745;">Long-term Discount Applied</small>' : ""}
                  </td>
                  <td>
                    Rs. ${(isLongTerm ? car.longPeriodRentPerDay : car.rentPerDay).toLocaleString()}
                    ${booking.withDriver ? "<br><small>+ Driver Service</small>" : ""}
                    ${booking.weddingPurpose ? "<br><small>+ Wedding Package</small>" : ""}
                  </td>
                  <td class="amount">Rs. ${booking.totalAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

            <div class="payment-summary">
              <h3>💰 Payment Summary</h3>
              <div class="payment-content">
                <div class="payment-row">
                  <span>Subtotal:</span>
                  <span>Rs. ${booking.totalAmount.toLocaleString()}</span>
                </div>
                <div class="payment-row">
                  <span>Advance Payment (30%):</span>
                  <span style="color:#28a745; font-weight:600;">Rs. ${advancePayment.toLocaleString()}</span>
                </div>
                <div class="payment-row">
                  <span>Balance Due at Pickup:</span>
                  <span style="color:#dc3545; font-weight:600;">Rs. ${balanceDue.toLocaleString()}</span>
                </div>
                <div class="payment-row total">
                  <span>Total Amount:</span>
                  <span>Rs. ${booking.totalAmount.toLocaleString()}</span>
                </div>
                <div class="payment-row" style="margin-top: 15px;">
                  <span>Payment Status:</span>
                  <span class="payment-status">CONFIRMED</span>
                </div>
              </div>
            </div>

            <div class="terms-section">
              <h3>📋 Terms & Important Information</h3>
              <ul class="terms-list">
                <li><strong>✅ Confirmation:</strong> Your booking is confirmed and a detailed email has been sent to ${booking.email}</li>
                <li><strong>💰 Payment:</strong> Rs. ${balanceDue.toLocaleString()} balance payment is due at vehicle pickup</li>
                <li><strong>📋 Documents Required:</strong> Valid driving license and government ID proof must be presented at pickup</li>
                <li><strong>⏰ Pickup Time:</strong> Vehicle available from 9:00 AM on ${new Date(booking.startDate).toLocaleDateString("en-GB")}</li>
                <li><strong>🔧 Vehicle Condition:</strong> Please inspect the vehicle before acceptance and report any damages immediately</li>
                <li><strong>⛽ Fuel Policy:</strong> Vehicle will be provided with full tank and should be returned with full tank</li>
                <li><strong>📞 Support:</strong> 24/7 customer support available at +94 11 234 5678</li>
                <li><strong>🚫 Cancellation:</strong> No Refund</li>
              </ul>
            </div>

            <div class="footer">
              <p><strong>Thank you for choosing IGGA HOLDING!</strong><br/>Your trusted partner for premium car rental services</p>
              <div style="margin-top:15px; padding-top:15px; border-top:1px solid #ddd;">
                <p>This is a computer-generated document and does not require a physical signature.</p>
                <p><strong>Generated on:</strong> ${new Date().toLocaleString("en-GB")} | <strong>Valid until:</strong> ${new Date(booking.endDate).toLocaleDateString("en-GB")}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([pdfContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ISGA-Invoice-${booking._id.slice(-8).toUpperCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert("Professional invoice downloaded successfully!");
  };

  const shareBooking = () => {
    if (navigator.share) {
      navigator.share({
        title: "Car Booking Confirmation - IGGA HOLDING",
        text: `My car booking for ${car.model} has been confirmed with IGGA HOLDING!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Booking details copied to clipboard!");
    }
  };

  return (
    <div className="booking-success-page">
      <div className="container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark" />
            </div>
          </div>
          <h1>Booking Confirmed!</h1>
          <p className="success-message">
            Your vehicle reservation has been successfully confirmed and payment processed.
          </p>
        </div>

        {/* Booking Reference */}
        <div className="booking-reference">
          <h2>Booking Reference</h2>
          <div className="reference-code">
            <span className="label">Booking ID:</span>
            <span className="code">{booking._id}</span>
            <button
              onClick={() => navigator.clipboard.writeText(booking._id)}
              className="copy-btn"
              title="Copy Booking ID"
            >
              📋
            </button>
          </div>
          {paymentIntent && (
            <div className="reference-code">
              <span className="label">Payment ID:</span>
              <span className="code">{paymentIntent.id}</span>
              <button
                onClick={() => navigator.clipboard.writeText(paymentIntent.id)}
                className="copy-btn"
                title="Copy Payment ID"
              >
                📋
              </button>
            </div>
          )}
        </div>

        {/* Quick Summary Card */}
        <div className="quick-summary">
          <div className="car-info">
            <img src={car.imageUrl || car.image} alt={car.model} />
            <div className="car-details">
              <h3>{car.model}</h3>
              <p>{car.carId}</p>
            </div>
          </div>
          <div className="booking-dates">
            <div className="date-item">
              <span className="label">Pick-up</span>
              <span className="date">{new Date(booking.startDate).toLocaleDateString("en-GB")}</span>
            </div>
            <div className="date-arrow">→</div>
            <div className="date-item">
              <span className="label">Return</span>
              <span className="date">{new Date(booking.endDate).toLocaleDateString("en-GB")}</span>
            </div>
          </div>
          <div className="payment-status">
            <span className="status-badge confirmed">Confirmed</span>
            <span className="amount">Rs. {advancePayment.toLocaleString()} Paid</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={() => setShowDetails(!showDetails)} className="details-btn">
            {showDetails ? "Hide Details" : "View Full Details"}
          </button>
          <button onClick={downloadBookingPDF} className="download-btn">
            📄 Download Invoice
          </button>
        </div>

        {/* Detailed Information */}
        {showDetails && (
          <div className="detailed-info">
            {/* Customer Info */}
            <div className="info-section">
              <h3>Customer Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Name</span>
                  <span className="value">{booking.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Email</span>
                  <span className="value">{booking.email}</span>
                </div>
                <div className="info-item">
                  <span className="label">Phone</span>
                  <span className="value">{booking.phone}</span>
                </div>
                {booking.altPhone && (
                  <div className="info-item">
                    <span className="label">Alt Phone</span>
                    <span className="value">{booking.altPhone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="info-section">
              <h3>Vehicle Information</h3>
              <div className="vehicle-details">
                <div className="vehicle-image">
                  <img src={car.imageUrl || car.image} alt={car.model} />
                </div>
                <div className="vehicle-specs">
                  <div className="spec-item">
                    <span className="label">Model</span>
                    <span className="value">{car.model}</span>
                  </div>
                  <div className="spec-item">
                    <span className="label">Registration</span>
                    <span className="value">{car.carId}</span>
                  </div>
                  <div className="spec-item">
                    <span className="label">Capacity</span>
                    <span className="value">{car.passengerCount} Passengers</span>
                  </div>
                  <div className="spec-item">
                    <span className="label">Daily Rate</span>
                    <span className="value">
                      Rs. {(isLongTerm ? car.longPeriodRentPerDay : car.rentPerDay).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rental Details */}
            <div className="info-section">
              <h3>Rental Details</h3>
              <div className="rental-details">
                <div className="rental-item">
                  <span className="label">Duration</span>
                  <span className="value">
                    {days} {days === 1 ? "Day" : "Days"}
                  </span>
                </div>
                <div className="rental-item">
                  <span className="label">Pick-up Date</span>
                  <span className="value">{new Date(booking.startDate).toLocaleDateString("en-GB")}</span>
                </div>
                <div className="rental-item">
                  <span className="label">Return Date</span>
                  <span className="value">{new Date(booking.endDate).toLocaleDateString("en-GB")}</span>
                </div>
                <div className="rental-item">
                  <span className="label">Driver Service</span>
                  <span className="value">{booking.withDriver ? "Yes" : "No"}</span>
                </div>
                <div className="rental-item">
                  <span className="label">Wedding Package</span>
                  <span className="value">{booking.weddingPurpose ? "Yes" : "No"}</span>
                </div>
                {isLongTerm && (
                  <div className="rental-item">
                    <span className="label">Long-term Discount</span>
                    <span className="value">Applied</span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="info-section">
              <h3>Payment Information</h3>
              <div className="payment-details">
                <div className="payment-item">
                  <span className="label">Total Amount</span>
                  <span className="value">Rs. {booking.totalAmount.toLocaleString()}</span>
                </div>
                <div className="payment-item paid">
                  <span className="label">Deposit Paid (30%)</span>
                  <span className="value">Rs. {advancePayment.toLocaleString()}</span>
                </div>
                <div className="payment-item pending">
                  <span className="label">Balance Due at Pickup</span>
                  <span className="value">Rs. {balanceDue.toLocaleString()}</span>
                </div>
                <div className="payment-item">
                  <span className="label">Payment Status</span>
                  <span className="value status-confirmed">Confirmed</span>
                </div>
                <div className="payment-item">
                  <span className="label">Booking Date</span>
                  <span className="value">{new Date(booking.createdAt).toLocaleString("en-GB")}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="navigation-buttons">
          <button onClick={() => navigate("/admin-dashboard")} className="home-btn">
            🏠 Back to Home
          </button>
          <button onClick={() => navigate("/Admin-Booking")} className="bookings-btn">
            📋 View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
