const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  image: String,
  courses: [mongoose.Types.ObjectId],
});

schema.index({ name: 'text' });

module.exports = mongoose.model('SubCategory', schema);
