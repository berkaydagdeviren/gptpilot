const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const ProductModel = require('../models/ProductModel');
const router = express.Router();

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

router.post('/api/import/products', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      const savePromises = results.map((row) => {
        return new ProductModel({
          name: row.name,
          price: parseFloat(row.price)
        }).save().catch(err => {
          if (err.code === 11000) {
            console.error(`Duplicate product name: ${row.name}`, err);
            return `Duplicate product name: ${row.name}`;
          } else {
            console.error('Error saving product', err);
            throw err;
          }
        });
      });

      Promise.allSettled(savePromises)
        .then((results) => {
          const errors = results.filter(result => result.status === 'rejected');
          if (errors.length > 0) {
            res.status(500).json({
              message: 'Some products were not imported due to errors.',
              errors: errors.map(err => err.reason.message)
            });
          } else {
            res.json({ message: 'All products imported successfully.' });
          }
        })
        .finally(() => {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting temporary file:', err);
          });
        });
    })
    .on('error', (err) => {
      console.error('Error processing CSV file:', err);
      res.status(500).json({ message: 'Error processing CSV file', error: err.message });
    });
});

module.exports = router;