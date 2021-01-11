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

exports.updateReview = async (req, res) => {
  try {
    console.log(req.params.reviewId, req.body);
    await Review.updateOne({ _id: req.params.reviewId, writer: req.user._id }, req.body);
    req.flash('info', 'Đã cập nhật nhận xét thành công');
  } catch (e) {
    req.flash('error', 'Không thể cập nhật nhận xét này');
  } finally {
    res.redirect('back');
  }
};

exports.deleteReview = async (req, res) => {
  try {
    await Review.deleteOne({ _id: req.params.reviewId, writer: req.user._id });
    await Course.updateOne({ _id: req.params.courseId }, { $pull: { reviews: req.params.reviewId } });
    req.flash('info', 'Đã xóa xét thành công');
  } catch (e) {
    req.flash('error', 'Không thể xóa nhận xét này');
  } finally {
    res.redirect('back');
  }
};
