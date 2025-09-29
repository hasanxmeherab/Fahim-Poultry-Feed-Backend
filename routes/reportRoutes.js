const express = require('express');
const router = express.Router();
const { getSalesReport, getBatchReport } = require('../controllers/reportController');const { protect } = require('../middleware/authMiddleware');

router.get('/sales', protect, getSalesReport);
router.get('/batch/:id', protect, getBatchReport);

module.exports = router;