const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import all route files
const transactionRoutes = require('../routes/transactionRoutes');
const dashboardRoutes = require('../routes/dashboardRoutes');
const reportRoutes = require('../routes/reportRoutes');
const batchRoutes = require('../routes/batchRoutes');
const customerRoutes = require('../routes/customerRoutes');
const productRoutes = require('../routes/productRoutes');
const saleRoutes = require('../routes/saleRoutes');
const userRoutes = require('../routes/userRoutes');
const wholesaleBuyerRoutes = require('../routes/wholesaleBuyerRoutes');
const wholesaleProductRoutes = require('../routes/wholesaleProductRoutes');

// Initialize the Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/batches', batchRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/wholesale-buyers', wholesaleBuyerRoutes);
app.use('/api/wholesale-products', wholesaleProductRoutes);

// Serverless-friendly database connection
const connectToDatabase = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }
  return mongoose.connect(process.env.MONGO_URI);
};

// Main handler for Vercel
module.exports = async (req, res) => {
  try {
    await connectToDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed.' });
  }
};