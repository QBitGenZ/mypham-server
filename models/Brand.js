const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  }
});

module.exports = mongoose.model('Brand', BrandSchema);