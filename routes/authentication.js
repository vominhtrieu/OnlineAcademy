const express = require('express');
const passport = require('passport');
const router = express.Router();
const authenticationController = require('../controller/authentication');

router.get('/signin', authenticationController.getSignInView);
router.get('/signup', authenticationController.getSignUpView);

router.post(
  '/signin',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
  }),
  authenticationController.signIn
);
router.post('/signup', authenticationController.signUp);

module.exports = router;
