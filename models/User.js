const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
var passportLocalMongoose = require('passport-local-mongoose');

const schema = new mongoose.Schema({
  email: String,
  facebookId: String,
  avatar: String,
  password: String,
  fullName: String,
  role: String,
  active: {
    type: Boolean,
    default: false,
  },
  favoriteCourses: [{ type: mongoose.Types.ObjectId, ref: 'Course' }],
});

schema.plugin(passportLocalMongoose, { usernameField: 'email' });

schema.pre('deleteOne', async function (next) {
  try {
    const user = await mongoose.model('User').find(this._condition);
    if (user.avatar) {
      fs.unlinkSync(path.join(__dirname, `../images/${avatar}`));
    }
    next();
  } catch (e) {
    next(err);
  }
});

module.exports = mongoose.model('User', schema);
