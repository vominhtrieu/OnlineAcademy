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

schema.pre('deleteOne', async function (next) {
  try {
    const section = await mongoose.model('Section').findById(this._conditions._id);
    await mongoose.model('Lecture').deleteMany({ _id: { $in: section.lectures } });
    next();
  } catch (e) {
    next(e);
  }
});

schema.pre('deleteMany', async function (next) {
  try {
    const sections = await mongoose.model('Section').find(this._conditions);
    await Promise.all(
      sections.map((section) => mongoose.model('Lecture').deleteMany({ _id: { $in: section.lectures } }))
    );
    next();
  } catch (e) {
    next(e);
  }
});

module.exports = mongoose.model('Section', schema);
