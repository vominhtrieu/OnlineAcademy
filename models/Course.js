const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  image: String,
  view: Number,
  reviews: [
    {
      type: mongoose.type.ObjectId,
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
