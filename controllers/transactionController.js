const Transaction = require('../models/transactionModel');

const getTransactions = async (req, res) => {
    try {
        const limit = 15;
        const page = Number(req.query.page) || 1;
        const count = await Transaction.countDocuments();
        const transactions = await Transaction.find({})
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1))
            .populate('customer', 'name')
            .populate('product', 'name');
        res.status(200).json({ 
            transactions, 
            page, 
            totalPages: Math.ceil(count / limit) 
        });
    } catch (error) {
        console.error("ERROR in getTransactions:", error);
        res.status(500).json({ error: error.message });
    }
};


const getTransactionsByBatch = async (req, res) => {
    try {
        const limit = 15;
        const page = Number(req.query.page) || 1;
        const batchId = req.params.batchId;

        // Build the filter object
        const filter = { batch: batchId };
        
        // NEW: Add date filter if a single date is provided
        if (req.query.date) {
            const searchDate = new Date(req.query.date);
            const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
            
            filter.createdAt = { $gte: startOfDay, $lte: endOfDay };
        }

        const count = await Transaction.countDocuments(filter);
        const transactions = await Transaction.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1))
            .populate('product', 'name');
        
        // ... (the rest of the function for calculating totals remains the same)
        const allBatchTransactions = await Transaction.find({ batch: batchId });
        let totalSoldInBatch = 0;
        let totalBoughtInBatch = 0;
        let totalChickensBought = 0;
        allBatchTransactions.forEach(t => {
            if (t.type === 'SALE') totalSoldInBatch += t.amount;
            if (t.type === 'BUY_BACK') {
                totalBoughtInBatch += t.amount;
                totalChickensBought += t.buyBackQuantity || 0;
            }
        });

        res.status(200).json({ 
            transactions,
            page,
            totalPages: Math.ceil(count / limit),
            totalSoldInBatch, 
            totalBoughtInBatch,
            totalChickensBought
        });
    } catch (error) {
        console.error("ERROR in getTransactionsByBatch:", error);
        res.status(500).json({ error: error.message });
    }
};

const getTransactionsForBuyer = async (req, res) => {
            //console.log("API HIT: Get transactions for buyer");  

    try {
        const limit = 15;
        const page = Number(req.query.page) || 1;
        const buyerId = req.params.buyerId;   
        const count = await Transaction.countDocuments({ wholesaleBuyer: buyerId });
        const transactions = await Transaction.find({ wholesaleBuyer: buyerId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1));

            //console.log("SUCCESS: Fetched transactions for buyer.");

        res.status(200).json({ 
            transactions, 
            page, 
            totalPages: Math.ceil(count / limit) 
        });
    } catch (error) {
        //console.error("ERROR in getTransactionsForBuyer:", error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    getTransactions,
    getTransactionsByBatch,
    getTransactionsForBuyer 
};