const User = require('../models/User');

exports.getSignInView = (_req, res) => {
  res.render('/signin');
};

exports.getSignUpView = (_req, res) => {
  res.render('/signup');
};

exports.signIn = (_req, _res) => {};

exports.signUp = (req, res) => {
  User.register(
    new User({ email: req.body.email, fullname: req.body.fullname }),
    req.body.password,
    (err, _user) => {
      if (err) {
        console.log(err);
        res.redirect('/signup');
      } else {
        passport.authenticate('local')(req, res, () => {
          res.redirect('/');
        });
      }
    }
  );
};
