const express = require('express');
const router = express.Router();
const controller = require('../controller/studentReview');

router.post('/:id/review', controller.addNewReview);

module.exports = router;
