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
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background-color: #2c5aa0; color: white; padding: 25px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: normal;">ISGA ENTERPRISE</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Car Rental Service</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 20px;">Welcome, ${name}!</h2>
          <p style="color: #666666; line-height: 1.5; margin-bottom: 20px;">Your account has been successfully created with ISGA Enterprise.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <p style="margin: 5px 0; color: #333333;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0; color: #333333;"><strong>Registration Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div style="text-align: center; margin: 25px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
               style="display: inline-block; background-color: #2c5aa0; color: white; padding: 12px 25px; 
                      text-decoration: none; border-radius: 5px; font-weight: 500;">
              Login to Your Account
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666666; font-size: 12px;">
          <p style="margin: 0;">This is an automated message from ISGA Enterprise.</p>
        </div>
      </div>
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
    subject: 'Booking Confirmation - ISGA Enterprise',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background-color: #2c5aa0; color: white; padding: 25px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: normal;">ISGA ENTERPRISE</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">Car Rental Service</p>
        </div>
        
        <!-- Success Message -->
        <div style="background-color: #d4edda; color: #155724; padding: 15px; text-align: center; border-bottom: 1px solid #c3e6cb;">
          <p style="margin: 0; font-weight: 500;">✓ Booking Confirmed Successfully</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px; background-color: #ffffff;">
          <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 20px;">Dear ${name},</h2>
          <p style="color: #666666; line-height: 1.5; margin-bottom: 25px;">
            Your car rental booking has been confirmed. Please find the essential details below:
          </p>
          
          <!-- Booking Details -->
          <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #2c5aa0; margin: 0 0 15px 0; font-size: 16px; border-bottom: 1px solid #dee2e6; padding-bottom: 8px;">
              Booking Details
            </h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #555555; font-weight: 500;">Booking ID:</td>
                <td style="padding: 8px 0; color: #333333; font-weight: 600;">${booking._id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555; font-weight: 500;">Vehicle:</td>
                <td style="padding: 8px 0; color: #333333; font-weight: 600;">${car.model}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555; font-weight: 500;">Car Number:</td>
                <td style="padding: 8px 0; color: #333333; font-weight: 600;">${car.carId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555; font-weight: 500;">Customer Phone:</td>
                <td style="padding: 8px 0; color: #333333; font-weight: 600;">${booking.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555; font-weight: 500;">Start Date:</td>
                <td style="padding: 8px 0; color: #333333; font-weight: 600;">${new Date(booking.startDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555; font-weight: 500;">End Date:</td>
                <td style="padding: 8px 0; color: #333333; font-weight: 600;">${new Date(booking.endDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #555555; font-weight: 500;">Amount Paid:</td>
                <td style="padding: 8px 0; color: #28a745; font-weight: 700;">Rs. ${booking.upfrontPayment.toLocaleString()}</td>
              </tr>
              <tr style="border-top: 1px solid #dee2e6;">
                <td style="padding: 12px 0 8px 0; color: #555555; font-weight: 500;">Balance at Pickup:</td>
                <td style="padding: 12px 0 8px 0; color: #dc3545; font-weight: 700; font-size: 16px;">Rs. ${(booking.totalAmount - booking.upfrontPayment).toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <!-- Important Notes -->
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h3 style="color: #856404; margin: 0 0 10px 0; font-size: 16px;">Important Information</h3>
            <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li>Please arrive 15 minutes early for vehicle pickup</li>
              <li>Bring valid driving license and ID proof</li>
              <li>Balance payment is due at pickup time</li>
              <li>Vehicle inspection will be done before handover</li>
            </ul>
          </div>
          
          <!-- Support -->
          <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
            <p style="color: #555555; margin: 0 0 10px 0;">Need assistance?</p>
            <p style="color: #2c5aa0; font-weight: 600; margin: 0;">
              📞 Contact us: +94 11 234 5678<br>
              📧 Email: ${process.env.EMAIL_USER}
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #2c5aa0; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px;">
            Thank you for choosing ISGA Enterprise<br>
            <span style="font-size: 12px; opacity: 0.8;">This is an automated confirmation email</span>
          </p>
        </div>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendUserConfirmationEmail, sendBookingConfirmationEmail };