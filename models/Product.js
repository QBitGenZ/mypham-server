const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:{
    type: String,
    require: true,
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProductType',
  },
  origin: {
    type: String,
    require: true,
  },
  volume: {
    type: String,
  },
  weight: {
    type: String,
  },
  utility: {
    type: String,
  },
  brand: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  cost: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  tags: [
    {type: String}
  ],
  images: [
    {type: String}
  ],
  productionDate: {
    type: Date,
  },
  expiryDate: {
    type: Date,
  },
  feedbacks:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
    }
  ]
});

module.exports = mongoose.model('Product', productSchema);