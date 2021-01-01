const express = require('express');
const router = express.Router();
const { checkAuthenticated } = require('../middlewares/auth');
const activationController = require('../controller/activation');

router.get('/active-account/:key', activationController.activeAccount);
router.get('/need-active', checkAuthenticated, activationController.getNeedActiveView);

module.exports = router;
