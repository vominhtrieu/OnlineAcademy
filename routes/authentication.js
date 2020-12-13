const express = require('express');
const router = express.Router();
const authenticationController = require('../controller/authentication');

router.get('/signin', authenticationController.getSignInView);
router.get('/signup', authenticationController.getSignUpView);

module.exports = router;
