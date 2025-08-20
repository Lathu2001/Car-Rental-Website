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


const app = express();
app.use(express.json());

// ✅ CORS Configuration
const allowedOrigins = [
    'http://localhost:5173', 
    'https://your-deployed-frontend.com' 
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

