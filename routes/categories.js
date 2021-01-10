const express = require('express');
const router = express.Router();
const flashInfo = require('../middlewares/flashInfo');
const controller = require('../controller/categories');

router.get('/:id', flashInfo, controller.getCoursesInCategory);

module.exports = router;
