const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/car'); 
const userRoutes = require('./routes/userRoutes');  
const reviewRoutes =require('./routes/review') 
require('dotenv').config();
const bookingRoutes = require('./routes/booking');
const paymentRoutes = require('./routes/payment');
const adminBookingRoutes = require('./routes/adminBooking');


const app = express();
app.use(express.json());

// ✅ CORS Configuration
const allowedOrigins = [
    'http://localhost:5173', 
    'https://car-rental-website-p4r9.vercel.app' 
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Handle MongoDB connection errors
mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
});

// ✅ Mount Routes
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use("/api/users", userRoutes); 
app.use('/api/review', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminBookingRoutes);

// ✅ Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Graceful Shutdown (Closes MongoDB Connection on Exit)
process.on('SIGINT', async () => {
    console.log("🛑 Shutting down...");
    await mongoose.connection.close();
    process.exit(0);
});
