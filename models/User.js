const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

const schema = new mongoose.Schema({
  email: String,
  password: String,
  fullName: String,
  type: Number,
});

schema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', schema);
