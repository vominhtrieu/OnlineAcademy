const express = require('express');
const router = express.Router();
const homeController = require('../controller/studentHome');

router.get('/', homeController.getHomeView);

module.exports = router;
