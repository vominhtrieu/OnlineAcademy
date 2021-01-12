const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const schema = mongoose.Schema({
  name: String,
  video: {
    path: String,
    extension: String,
  },
  preview: {
    type: Boolean,
    default: false,
  },
});

schema.pre('deleteOne', async function (next) {
  try {
    const lecture = await mongoose.model('Lecture').findOne(this._conditions);
    fs.unlinkSync(path.join(__dirname, '../videos/' + lecture.video.path));
    next();
  } catch (e) {
    next(e);
  }
});

schema.pre('deleteMany', async function (next) {
  try {
    const lectures = await mongoose.model('Lecture').find(this._conditions);
    lectures.forEach((lecture) => {
      fs.unlinkSync(path.join(__dirname, '../videos/' + lecture.video.path));
    });
    next();
  } catch (e) {
    next(e);
  }
});

module.exports = mongoose.model('Lecture', schema);
