const nodemailer = require('nodemailer');
require('dotenv').config();

/* ================================
   EMAIL TRANSPORTER
================================ */
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER or EMAIL_PASS environment variables not set");
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    secure: true,
    port: 465,
  });
};

let transporter;
try {
  transporter = createTransporter();
  console.log("✅ Mail transporter configured successfully");
} catch (err) {
  console.error("❌ Failed to configure mail transporter:", err.message);
}

/* ================================
   SEND USER CONFIRMATION EMAIL
================================ */
async function sendUserConfirmationEmail(email, name) {
  if (!transporter) throw new Error('Email transporter not configured');

  const mailOptions = {
    from: `"ISGA ENTERPRISE" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Car Rental Service',
    html: `
      <h2>Welcome, ${name}!</h2>
      <p>Your account has been successfully created.</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Registration Date:</b> ${new Date().toLocaleDateString()}</p>
      <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login">Login Here</a>
    `
  };

  return transporter.sendMail(mailOptions);
}

/* ================================
   SEND BOOKING CONFIRMATION EMAIL
================================ */
async function sendBookingConfirmationEmail(email, name, booking, car) {
  if (!transporter) throw new Error('Email transporter not configured');

  const mailOptions = {
    from: `"ISGA ENTERPRISE" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Booking Confirmation - Car Rental Service',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; padding: 20px;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 300;">ISGA ENTERPRISE</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 16px;">Car Rental Service</p>
        </div>
        
        <!-- Main Content -->
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <!-- Success Badge -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; background: #d4edda; color: #155724; padding: 12px 24px; border-radius: 25px; font-weight: 500; font-size: 14px; border: 1px solid #c3e6cb;">
              ✓ Booking Confirmed Successfully
            </div>
          </div>
          
          <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px; font-weight: 400;">Dear ${name},</h2>
          <p style="color: #666; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">We're pleased to confirm your car rental booking. Here are your reservation details:</p>
          
          <!-- Booking Details Card -->
          <div style="background: #f8f9fb; border: 1px solid #e9ecef; border-radius: 8px; padding: 25px; margin: 25px 0;">
            <h3 style="color: #495057; margin: 0 0 20px 0; font-size: 18px; font-weight: 500; border-bottom: 2px solid #dee2e6; padding-bottom: 10px;">Booking Details</h3>
            
            <div style="display: grid; gap: 15px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                <span style="color: #6c757d; font-weight: 500;">Vehicle:</span>
                <span style="color: #495057; font-weight: 600;">${car.model}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                <span style="color: #6c757d; font-weight: 500;">Rental Period:</span>
                <span style="color: #495057; font-weight: 600;">${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e9ecef;">
                <span style="color: #6c757d; font-weight: 500;">Total Amount:</span>
                <span style="color: #28a745; font-weight: 700; font-size: 18px;">Rs. ${booking.totalAmount}</span>
              </div>
              
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
                <span style="color: #6c757d; font-weight: 500;">Contact Number:</span>
                <span style="color: #495057; font-weight: 600;">${booking.phone}</span>
              </div>
            </div>
          </div>
          
          <!-- What's Next Section -->
          <div style="background: #e3f2fd; border-left: 4px solid #2196f3; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h4 style="color: #1565c0; margin: 0 0 10px 0; font-size: 16px;">What's Next?</h4>
            <p style="color: #1976d2; margin: 0; line-height: 1.5; font-size: 14px;">
              Please arrive 15 minutes early for pickup. Bring a valid driver's license and any required documentation.
            </p>
          </div>
          
          <!-- Contact Support -->
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6c757d; margin: 0 0 15px 0; font-size: 14px;">Need help or have questions?</p>
            <a href="mailto:${process.env.EMAIL_USER}" style="display: inline-block; background: #667eea; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">Contact Support</a>
          </div>
          
          <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #dee2e6;">
            <p style="color: #495057; margin: 0; font-size: 16px; line-height: 1.5;">
              Thank you for choosing our service.<br>
              <span style="font-weight: 600; color: #667eea;">ISGA ENTERPRISE</span>
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; padding: 20px; color: #6c757d; font-size: 12px;">
          <p style="margin: 0;">This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendUserConfirmationEmail, sendBookingConfirmationEmail };
