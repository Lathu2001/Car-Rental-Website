const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/create-payment-intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency: 'usd',
      automatic_payment_methods: { enabled: true }
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("❌ Stripe PaymentIntent error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
