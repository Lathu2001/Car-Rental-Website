// routes/payment.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');

// ✅ Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, bookingId, metadata = {} } = req.body;

    // Validate amount
    if (!amount || amount < 50) { // Minimum 50 cents
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    // Validate booking exists
    if (bookingId) {
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      // Check if booking is still pending
      if (booking.status !== 'pending') {
        return res.status(400).json({ message: 'Booking is not in pending state' });
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure amount is integer
      currency: 'lkr', // Sri Lankan Rupees
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

// ✅ Webhook to handle payment confirmations
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update booking status if bookingId is in metadata
      if (paymentIntent.metadata.bookingId && paymentIntent.metadata.bookingId !== 'unknown') {
        try {
          const booking = await Booking.findById(paymentIntent.metadata.bookingId);
          if (booking && booking.status === 'pending') {
            booking.status = 'confirmed';
            booking.paymentIntentId = paymentIntent.id;
            await booking.save();
            console.log(`Booking ${booking._id} confirmed via webhook`);
          }
        } catch (err) {
          console.error('Error updating booking via webhook:', err);
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Optionally handle failed payments
      if (failedPayment.metadata.bookingId && failedPayment.metadata.bookingId !== 'unknown') {
        try {
          const booking = await Booking.findById(failedPayment.metadata.bookingId);
          if (booking && booking.status === 'pending') {
            // Optionally set booking to cancelled or keep as pending
            console.log(`Payment failed for booking ${booking._id}`);
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
router.get('/status/:paymentIntentId', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.paymentIntentId);
    
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      created: paymentIntent.created
    });

  } catch (error) {
    console.error('Error retrieving payment status:', error);
    res.status(500).json({ message: 'Error retrieving payment status' });
  }
});

// ✅ Refund payment (for cancellations)
router.post('/refund/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const { amount, reason = 'requested_by_customer' } = req.body;

    // Retrieve the payment intent to get the charge
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment was not successful, cannot refund' });
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount, // If not provided, refunds full amount
      reason: reason
    });

    // Update booking status if needed
    if (paymentIntent.metadata.bookingId && paymentIntent.metadata.bookingId !== 'unknown') {
      try {
        const booking = await Booking.findById(paymentIntent.metadata.bookingId);
        if (booking) {
          booking.status = 'cancelled';
          await booking.save();
          console.log(`Booking ${booking._id} cancelled due to refund`);
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