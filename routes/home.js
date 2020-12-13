const express = require('express');
const router = express.Router();
const homeController = require('../controller/home');

router.get('/', homeController.getHomeView);

module.exports = router;
