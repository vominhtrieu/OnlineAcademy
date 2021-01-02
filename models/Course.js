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
  completed: {
    type: Boolean,
    default: false,
  },

  lecturer: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  sections: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Section',
    },
  ],
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Review',
    },
  ],
  students: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Course', schema);
