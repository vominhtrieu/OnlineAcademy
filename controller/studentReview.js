const Course = require('../models/Course');
const Review = require('../models/Review');

exports.addNewReview = (req, res) => {
  Review.create(
    {
      message: req.body.message,
      score: req.body.score,
      writer: req.user._id,
    },
    (err, review) => {
      if (err) {
        req.flash('error', 'Không thể thêm nhận xét');
        res.redirect(`/courses/${req.params.id}`);
      }
      Course.updateOne(
        { _id: req.params.id },
        {
          $push: { reviews: review._id },
        },
        (err, course) => {
          if (err || !course) {
            req.flash('error', 'Không thể thêm nhận xét');
          } else {
            req.flash('info', 'Đã nhận xét thành công');
          }

          res.redirect(`/courses/${req.params.id}`);
        }
      );
    }
  );
};
