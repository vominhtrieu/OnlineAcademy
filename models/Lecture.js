const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  video: String,
});

module.exports = mongoose.model('Lecture', schema);
