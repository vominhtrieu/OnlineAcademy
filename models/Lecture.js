const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  video: {
    path: String,
    publicId: String, //use for cloudinary
    extension: String,
  },
  preview: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Lecture', schema);
