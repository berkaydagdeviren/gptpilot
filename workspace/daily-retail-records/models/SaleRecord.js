const mongoose = require('mongoose');

const saleRecordSchema = new mongoose.Schema({
  companyName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  itemsSold: [{
    itemName: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
    },
    isDifferentPrice: {
      type: Boolean,
      default: false,
    },
    priceColor: {
      type: String,
      enum: ['white', 'black'],
    },
  }],
  isDownloaded: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('SaleRecord', saleRecordSchema);