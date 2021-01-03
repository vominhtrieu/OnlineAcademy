const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  video: String,
  extension: String,
});

module.exports = mongoose.model('Lecture', schema);
