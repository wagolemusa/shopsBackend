
const mongoose = require('mongoose');
const OrderSchema = mongoose.Schema({
  products: {
    type: Object
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  status: {
    type: String,
    default: 'processing'
  },
  total : {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  },
  date: {
    type: String,
    default: new Date().toISOString().split('T')[0]
  },
  district: {
    type: String,
  },
  town: {
    type: String,
  },
  phone: {
    type: Number,
  }
}, {minimize: false});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;