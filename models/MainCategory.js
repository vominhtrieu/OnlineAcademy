const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  subCategories: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'SubCategory',
    },
  ],
});

module.exports = mongoose.model('MainCategory', schema);
