const mongoose = require('mongoose');
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

module.exports = mongoose.model('User', schema);
