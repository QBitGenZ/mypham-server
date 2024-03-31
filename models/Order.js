const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  deliveryMethod: {
    type: String,
    required: true,
  } ,
  address: {
    type: String,
    required: true,
  },
  items:[
    orderItemSchema
  ],
  created_at: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: String,
    default: 'Chờ xác nhận'
  }
})

module.exports = mongoose.model('Order', orderSchema);