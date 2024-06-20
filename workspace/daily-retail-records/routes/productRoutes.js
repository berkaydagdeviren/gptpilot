const express = require('express');
const router = express.Router();
const Product = require('../models/ProductModel'); // Assuming you have a ProductModel

// Log for server startup
console.log('Setting up product routes');

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    console.log('Fetching all products');
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(400).send(error);
  }
});

module.exports = router;