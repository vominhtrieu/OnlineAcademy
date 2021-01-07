const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  video: String,
  extension: String,
  preview: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Lecture', schema);
