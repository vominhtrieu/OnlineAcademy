const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  image: String,
  courses: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Course',
    },
  ],
});

schema.index({ name: 'text' });

module.exports = mongoose.model('SubCategory', schema);
