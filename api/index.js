const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import all your route files
const customerRoutes = require('../routes/customerRoutes');
const productRoutes = require('../routes/productRoutes');
const saleRoutes = require('../routes/saleRoutes');
const userRoutes = require('../routes/userRoutes');
// ... import all your other route files ...

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/users', userRoutes);
// ... add all your other app.use() lines for your routes ...


// --- NEW SERVERLESS DATABASE CONNECTION LOGIC ---

// This function connects to the DB and caches the connection.
// It's called on the first request and re-used on subsequent requests.
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  return mongoose.connect(process.env.MONGO_URI);
};


// This is the main handler Vercel will run
module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    // Once connected, we pass the request to our Express app
    return app(req, res);
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed.' });
  }
};