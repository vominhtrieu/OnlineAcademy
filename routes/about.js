const express = require('express');
const router = express.Router();
const controller = require('../controller/about');

router.get('/', controller.getAboutView);

module.exports = router;
