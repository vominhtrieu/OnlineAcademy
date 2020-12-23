const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: String,
  fullName: String,
  type: Number,
});

schema.plugin(passportLocalMongoose, { usernameField : 'email' });

module.exports = mongoose.model('User', schema);
