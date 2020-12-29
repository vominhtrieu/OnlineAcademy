const express = require('express');
const router = express.Router();
const { checkIsAdmin } = require('../middlewares/auth');
const adminController = require('../controller/adminDashboard');

router.get('/', checkIsAdmin, adminController.getDashboard);

module.exports = router;
