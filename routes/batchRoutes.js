const express = require('express');
const router = express.Router();
const { startNewBatch, getBatchesForCustomer, buyBackAndEndBatch } = require('../controllers/batchController');const { protect } = require('../middleware/authMiddleware');

router.post('/start', protect, startNewBatch);
router.get('/customer/:id', protect, getBatchesForCustomer);
router.patch('/:id/buyback', protect, buyBackAndEndBatch);

module.exports = router;