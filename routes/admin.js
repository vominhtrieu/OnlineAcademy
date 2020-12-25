const express = require('express');
const router = express.Router();
const { checkIsAdmin } = require('../middlewares/auth');
const adminController = require('../controller/admin');

router.get('/', checkIsAdmin, adminController.getDashboard);

module.exports = router;
