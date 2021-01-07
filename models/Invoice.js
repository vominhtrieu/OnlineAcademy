const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  fee: Number,
  date: {
    type: Date,
    default: Date.now,
  },
});

schema.pre('save', function (next) {
  mongoose.model('Course').updateOne({ _id: this.course }, { $inc: { studentCount: 1 } }, (err) => {
    next(err);
  });
});

module.exports = mongoose.model('Invoice', schema);
