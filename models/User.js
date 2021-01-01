const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: String,
  fullName: String,
  role: String,
  active: {
    type: Boolean,
    default: false,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
});

schema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', schema);
