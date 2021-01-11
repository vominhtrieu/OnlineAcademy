const express = require('express');
const router = express.Router();
const controller = require('../controller/studentReview');

router.post('/:id/review', controller.addNewReview);
router.put('/:courseId/review/:reviewId', controller.updateReview);
router.delete('/:courseId/review/:reviewId', controller.deleteReview);

module.exports = router;
