const mongoose = require('mongoose');

const schema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: 'Course',
  },
  stopAt: {
    section: {
      type: Number,
      default: 0,
    },
    lecture: {
      type: Number,
      default: 0,
    },
  },
  lectures: [
    {
      lecture: {
        type: mongoose.Types.ObjectId,
        ref: 'Lecture',
      },
      complete: Number,
    },
  ],
});

module.exports = mongoose.model('Record', schema);
