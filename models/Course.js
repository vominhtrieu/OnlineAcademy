const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  avatar: String,
  description: String,
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'SubCategory',
  },
  price: Number,
  discount: {
    type: Number,
    default: 0,
  },
  view: Number,
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Review',
    },
  ],
  lecturer: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  students: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Course', schema);
