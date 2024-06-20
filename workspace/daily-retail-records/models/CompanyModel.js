const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: false
  }
}, { timestamps: true });

companySchema.pre('save', async function(next) {
  console.log(`Saving company: ${this.name}`);
  next();
});

companySchema.post('save', function(doc) {
  console.log(`Company ${doc.name} saved successfully`);
});

companySchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.error('There was a duplicate key error', error);
    next(new Error('Duplicate key error: A company with this name already exists.'));
  } else {
    console.error('Error saving company', error);
    next(error);
  }
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;