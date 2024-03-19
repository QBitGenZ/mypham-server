const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
  },
  numberStart: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  images: [
    {
      type: String,
    }
  ],
  creatAt: {
    type: Date,
    default: Date.now()
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }
})