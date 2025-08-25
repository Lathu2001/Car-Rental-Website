// routes/payment.js - Updated version
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

// ✅ Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, bookingId, metadata = {} } = req.body;

    // Validate amount
    if (!amount || amount < 50) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    // Validate booking exists
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      if (booking.status !== 'pending') {
        return res.status(400).json({ message: 'Booking is not in pending state' });
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: 'lkr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        bookingId: bookingId || 'unknown',
        ...metadata
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ 
      message: 'Error creating payment intent',
      error: error.message 
    });
  }
});

// ✅ Updated Webhook to handle new booking model
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      if (paymentIntent.metadata.bookingId && paymentIntent.metadata.bookingId !== 'unknown') {
        try {
          const booking = await Booking.findById(paymentIntent.metadata.bookingId);
          if (booking && booking.status === 'pending') {
            // Update booking with payment details
            booking.status = 'confirmed';
            booking.paymentIntentId = paymentIntent.id;
            booking.paidAmount = paymentIntent.amount / 100; // Convert from cents
            booking.paymentMethod = 'card';
            
            await booking.save();
            console.log(`Booking ${booking._id} confirmed via webhook with payment amount: ${booking.paidAmount}`);
          }
        } catch (err) {
          console.error('Error updating booking via webhook:', err);
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      if (failedPayment.metadata.bookingId && failedPayment.metadata.bookingId !== 'unknown') {
        try {
          const booking = await Booking.findById(failedPayment.metadata.bookingId);
          if (booking && booking.status === 'pending') {
            console.log(`Payment failed for booking ${booking._id}`);
            // Optionally set booking status or add failed payment note
            booking.notes = (booking.notes || '') + `Payment failed: ${failedPayment.id} at ${new Date().toISOString()}. `;
            await booking.save();
          }
        } catch (err) {
          console.error('Error handling failed payment:', err);
        }
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

// ✅ Get payment status


// ✅ Updated Refund payment
router.post('/refund/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const { amount, reason = 'requested_by_customer' } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment was not successful, cannot refund' });
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount,
      reason: reason
    });

    // Update booking with refund details
    if (paymentIntent.metadata.bookingId && paymentIntent.metadata.bookingId !== 'unknown') {
      try {
        const booking = await Booking.findById(paymentIntent.metadata.bookingId);
        if (booking) {
          booking.status = 'cancelled';
          booking.paidAmount = Math.max(0, booking.paidAmount - (refund.amount / 100)); // Subtract refund amount
          booking.notes = (booking.notes || '') + `Refunded: Rs.${refund.amount / 100} on ${new Date().toISOString()}. `;
          await booking.save();
          console.log(`Booking ${booking._id} cancelled and refund of Rs.${refund.amount / 100} processed`);
        }
      } catch (err) {
        console.error('Error updating booking after refund:', err);
      }
    }

    res.json({
      message: 'Refund processed successfully',
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
        currency: refund.currency
      }
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ 
      message: 'Error processing refund',
      error: error.message 
    });
  }
});

module.exports = router;