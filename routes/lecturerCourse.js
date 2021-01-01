const express = require('express');
const router = express.Router();
const flashInfo = require('../middlewares/flashInfo');
const controller = require('../controller/lecturerCourse');
const multer = require('multer');
const upload = multer({ dest: 'images/' });

router.get('/new', flashInfo, controller.getAddNewCourseView);
router.post('/', upload.single('avatar'), controller.addNewCourse);

module.exports = router;
