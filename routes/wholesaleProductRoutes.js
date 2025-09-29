const express = require('express');
const router = express.Router();
const { getProducts, createProduct } = require('../controllers/wholesaleProductController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProducts).post(protect, createProduct);

module.exports = router;