const express = require('express');
const router = express.Router();
const homeController = require('../controller/studentHome');
const flashInfo = require('../middlewares/flashInfo');

router.get('/', flashInfo, homeController.getHomeView);

module.exports = router;
