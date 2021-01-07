const mongoose = require('mongoose');

const schema = mongoose.Schema({
  message: String,
  score: Number,
  writer: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Review', schema);
