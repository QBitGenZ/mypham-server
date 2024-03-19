const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    require: true
  },
  addresses: [
    {
      type: String,
    },
  ],
  avatar: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  gender: {
    type: String,
    enum: [
      'Male',
      'Female',
    ],
    default: 'Female',
  },
  birthday: {
    type: Date,
    required: true,
  },
  userType: {
    type: String,
    enum: [
      'seller',
      'buyer',
    ],
    default: 'buyer',
  }
});

let User = mongoose.model('User', userSchema);

module.exports = User;