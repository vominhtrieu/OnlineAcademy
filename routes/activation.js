const express = require('express');
const router = express.Router();
const passport = require('passport');
const activationController = require('../controller/activation');

router.get('/active-account/:key', activationController.activeAccount);
router.get('/need-active', activationController.getNeedActiveView);

module.exports = router;
