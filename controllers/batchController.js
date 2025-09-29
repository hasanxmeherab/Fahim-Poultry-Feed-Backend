const Batch = require('../models/batchModel');
const Customer = require('../models/customerModel');

// @desc    Start a new batch for a customer
const startNewBatch = async (req, res) => {
    const { customerId } = req.body;
    try {
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Find and complete any existing active batch
        const existingBatch = await Batch.findOne({ customer: customerId, status: 'Active' });
        if (existingBatch) {
            existingBatch.status = 'Completed';
            existingBatch.endDate = new Date();
            existingBatch.endingBalance = customer.balance;
            await existingBatch.save();
        }

        // Correctly calculate the next batch number
        const batchCount = await Batch.countDocuments({ customer: customerId });
        const newBatchNumber = batchCount + 1;

        // Create the new batch with the required batchNumber
        const newBatch = await Batch.create({
            customer: customerId,
            startingBalance: customer.balance,
            batchNumber: newBatchNumber, // This line is crucial
        });

        res.status(201).json(newBatch);

    } catch (error) {
        console.error("ERROR STARTING BATCH:", error);
        res.status(500).json({ message: 'Server error starting new batch', error: error.message });
    }
};

// @desc    Get all batches for a single customer
const getBatchesForCustomer = async (req, res) => {
    try {
        const batches = await Batch.find({ customer: req.params.id }).sort({ startDate: -1 });
        res.status(200).json(batches);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching batches' });
    }
};

const buyBackAndEndBatch = async (req, res) => {
    const { quantity, weight, pricePerKg } = req.body;
    const batchId = req.params.id;

    // Validate input
    if (!quantity || !weight || !pricePerKg) {
        return res.status(400).json({ message: 'Quantity, weight, and price per kg are required.' });
    }

    try {
        const batch = await Batch.findById(batchId).populate('customer');
        if (!batch || batch.status !== 'Active') {
            return res.status(404).json({ message: 'Active batch not found' });
        }

        const customer = batch.customer;
        const balanceBefore = customer.balance;
        const totalAmount = parseFloat(weight) * parseFloat(pricePerKg);

        // Add the buy-back value to the customer's balance
        customer.balance += totalAmount;
        await customer.save();

        // Mark the batch as completed
        batch.status = 'Completed';
        batch.endDate = new Date();
        batch.endingBalance = customer.balance;
        await batch.save();
        
        // Log the detailed buy-back as a transaction
        await Transaction.create({
            type: 'BUY_BACK',
            customer: customer._id,
            amount: totalAmount,
            buyBackQuantity: quantity,
            buyBackWeight: weight,
            buyBackPricePerKg: pricePerKg,
            balanceBefore: balanceBefore,
            balanceAfter: customer.balance,
            notes: `Bought back ${quantity} chickens (${weight}kg @ TK ${pricePerKg}/kg)`,
            batch: batch._id,
        });

        res.status(200).json({ message: 'Batch ended and account settled successfully' });

    } catch (error) {
        console.error("BUY BACK ERROR:", error);
        res.status(500).json({ message: 'Server error during buy-back', error });
    }
};

module.exports = { startNewBatch, getBatchesForCustomer, buyBackAndEndBatch };