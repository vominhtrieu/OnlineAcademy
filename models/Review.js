const mongoose = require('mongoose');

const schema = mongoose.Schema({
  comment: String,
  rating: Number,
  writer: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Course', schema);
