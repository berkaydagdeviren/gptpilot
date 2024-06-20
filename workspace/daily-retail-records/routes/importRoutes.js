const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const CompanyModel = require('../models/CompanyModel');
const router = express.Router();

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' });

router.post('/companies', upload.single('file'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Process the CSV data
      const savePromises = results.map((row) => {
        return new Promise((resolve, reject) => {
          const company = new CompanyModel({
            name: row.name, // Assuming CSV has a 'name' column for company names
            address: row.address // Assuming CSV has an 'address' column for company addresses
          });
          company.save()
            .then(resolve)
            .catch((err) => {
              if (err.code === 11000) {
                // Duplicate key error
                console.log(`Duplicate company name: ${row.name}`);
                resolve(`Duplicate company name: ${row.name}`);
              } else {
                console.error(`Error saving company ${row.name}: ${err}`);
                reject(new Error(`Error saving company ${row.name}: ${err.message}`));
              }
            });
        });
      });

      Promise.all(savePromises)
        .then((results) => {
          const errors = results.filter(result => typeof result === 'string');
          if (errors.length > 0) {
            console.log('Some companies were not imported due to errors');
            res.json({
              message: 'Some companies were not imported successfully',
              errors: errors
            });
          } else {
            console.log('All companies imported successfully');
            res.json({ message: 'All companies imported successfully' });
          }
        })
        .catch((err) => {
          console.error('Unexpected error saving companies to database:', err);
          res.status(500).json({ message: 'Unexpected error saving companies to database', error: err.message });
        })
        .finally(() => {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting temporary file:', err);
            else console.log('Temporary file deleted successfully');
          });
        });
    })
    .on('error', (err) => {
      console.error('Error processing CSV file:', err);
      res.status(500).json({ message: 'Error processing CSV file', error: err.message });
    });
});

module.exports = router;