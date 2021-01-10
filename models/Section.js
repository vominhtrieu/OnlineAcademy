const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  lectures: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Lecture',
    },
  ],
});

schema.pre('deleteOne', (next) => {
  console.log('Alo');
});

module.exports = mongoose.model('Section', schema);
