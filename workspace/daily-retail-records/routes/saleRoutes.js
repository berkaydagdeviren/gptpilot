const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const SaleRecord = require('../models/SaleRecord');
const Company = require('../models/CompanyModel'); // Importing Company model
const Product = require('../models/ProductModel'); // Importing Product model
const { uploadCsv, downloadSalesRecords } = require('../controllers/saleController');
const router = express.Router();

// Setup storage engine for multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Add a Sale Record
router.post('/', async (req, res) => {
  try {
    const saleRecord = new SaleRecord(req.body);
    await saleRecord.save();
    console.log('Sale record added:', saleRecord);
    res.status(201).json(saleRecord);
  } catch (error) {
    console.error('Error adding sale record:', error);
    res.status(400).json({ message: error.message });
  }
});

// New POST endpoint for adding a sale record with products, quantities, and prices
router.post('/api/sales', async (req, res) => {
  const { companyName, items } = req.body;

  if (!companyName || !items || items.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const validatedItems = await Promise.all(items.map(async item => {
      if (!mongoose.Types.ObjectId.isValid(item.productId)) {
        throw new Error(`Invalid product ID: ${item.productId}`);
      }
      const product = await Product.findById(item.productId);
      if (!product) {
        throw new Error(`Product not found with ID: ${item.productId}`);
      }
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.price || product.price // Use provided price or default to product price
      };
    }));

    const company = await Company.findOne({ name: companyName });
    if (!company) {
      throw new Error(`Company not found: ${companyName}`);
    }

    const saleRecord = new SaleRecord({
      companyName: company._id,
      itemsSold: validatedItems,
    });

    await saleRecord.save();
    console.log('Sale record with products added:', saleRecord);
    res.status(201).json(saleRecord);
  } catch (error) {
    console.error('Error adding sale record with products:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Edit a Sale Record
router.patch('/:id', async (req, res) => {
  try {
    const { itemsSold } = req.body;
    const updatedSaleRecord = await SaleRecord.findByIdAndUpdate(req.params.id, { $set: { itemsSold: itemsSold } }, { new: true });
    console.log('Sale record updated:', updatedSaleRecord);
    res.json(updatedSaleRecord);
  } catch (error) {
    console.error('Error updating sale record:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a Sale Record
router.delete('/:id', async (req, res) => {
  try {
    await SaleRecord.findByIdAndDelete(req.params.id);
    console.log('Sale record deleted with id:', req.params.id);
    res.json({ message: 'Sale record deleted successfully' });
  } catch (error) {
    console.error('Error deleting sale record:', error);
    res.status(400).json({ message: error.message });
  }
});

// Fetch Sale Records
router.get('/', async (req, res) => {
  try {
    const saleRecords = await SaleRecord.find().populate('companyName', 'name').populate('itemsSold.productId', 'name price');
    console.log('Fetched sale records:', saleRecords);
    res.json(saleRecords);
  } catch (error) {
    console.error('Error fetching sale records:', error);
    res.status(400).json({ message: error.message });
  }
});

// Upload CSV endpoint
router.post('/upload', upload.single('file'), (req, res) => {
  uploadCsv(req, res).catch(error => {
    console.error('Error processing CSV upload:', error);
    res.status(500).json({ message: 'Failed to process CSV upload', error: error.message });
  });
});

// Download Sales Records as Excel
router.get('/download', (req, res) => {
  downloadSalesRecords(req, res).catch(error => {
    console.error('Error downloading sales records:', error);
    res.status(500).json({ message: 'Failed to download sales records', error: error.message });
  });
});

module.exports = router;