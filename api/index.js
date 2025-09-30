// /api/index.js

// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Vercel handles .env variables via Project Settings

// Import routes
const batchRoutes = require('../routes/batchRoutes');
const customerRoutes = require('../routes/customerRoutes');
const productRoutes = require('../routes/productRoutes');
const saleRoutes = require('../routes/saleRoutes');
const transactionRoutes = require('../routes/transactionRoutes');
const userRoutes = require('../routes/userRoutes');
const dashboardRoutes = require('../routes/dashboardRoutes');
const reportRoutes = require('../routes/reportRoutes');
const wholesaleBuyerRoutes = require('../routes/wholesaleBuyerRoutes');
const wholesaleProductRoutes = require('../routes/wholesaleProductRoutes');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Connect to MongoDB
// It's good practice to connect here so the connection is ready for incoming requests
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB!'))
  .catch((err) => console.error('Database connection failed:', err));

// API Routes
// ✅ IMPORTANT: Notice the '/api' prefix is removed from these routes.
// The vercel.json rewrite rule already handles the /api part.
app.use('/batches', batchRoutes);
app.use('/reports', reportRoutes);
app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/sales', saleRoutes);
app.use('/transactions', transactionRoutes);
app.use('/users', userRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/wholesale-buyers', wholesaleBuyerRoutes);
app.use('/wholesale-products', wholesaleProductRoutes);

// Export the Express app
module.exports = app;