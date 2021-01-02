const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  lecture: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Lecture',
    },
  ],
});

module.exports = mongoose.model('Section', schema);
