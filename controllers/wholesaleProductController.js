const WholesaleProduct = require('../models/wholesaleProductModel');

const getProducts = async (req, res) => {
    try {
        const keyword = req.query.search
            ? { name: { $regex: req.query.search, $options: 'i' } }
            : {};
        const products = await WholesaleProduct.find({ ...keyword }).sort({ name: 1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const newProduct = await WholesaleProduct.create({ name: req.body.name });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { getProducts, createProduct };