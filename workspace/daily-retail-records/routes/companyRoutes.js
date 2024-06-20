const express = require('express');
const router = express.Router();
const Company = require('../models/CompanyModel'); // Assuming you have a CompanyModel

// Log for server startup
console.log('Setting up company routes');

router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    console.log('Fetching all companies');
    res.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(400).send(error);
  }
});

module.exports = router;