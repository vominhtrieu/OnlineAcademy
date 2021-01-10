const express = require('express');
const router = express.Router();
const { checkIsAdmin } = require('../middlewares/auth');
const flashInfo = require('../middlewares/flashInfo');
const controller = require('../controller/adminLecturer');

router.get('/', checkIsAdmin, flashInfo, controller.getLecturerList);
router.post('/', checkIsAdmin, controller.addNewLecturer);
router.put('/:id', checkIsAdmin, controller.updateLecturer);
router.delete('/:id', checkIsAdmin, controller.deleteLecturer);

module.exports = router;
