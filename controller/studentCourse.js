const Course = require('../models/Course');
const Invoice = require('../models/Invoice');
const mongoose = require('mongoose');

exports.getCourseDetail = (req, res) => {
  Course.updateOne({ _id: req.params.id }, { $inc: { viewCount: 1 } }, (err, course) => {
    if (err || !course) {
      req.flash('error', 'Không tìm thấy khóa học');
      res.redirect('/');
    }
    Course.getCourseDetail(new mongoose.Types.ObjectId(req.params.id), (err, course) => {
      if (err || !course) {
        req.flash('error', 'Không tìm thấy khóa học');
        res.redirect('/');
      } else {
        if (!req.user) {
          res.render('student/courseDetail', { course });
        } else {
          Invoice.findOne(
            {
              user: req.user._id,
              course: course._id,
            },
            (err, invoice) => {
              if (err) {
                req.flash('error', 'Đã xảy ra lỗi');
                res.redirect('/');
              }
              res.render('student/courseDetail', { course, invoice });
            }
          );
        }
      }
    });
  });
};

exports.enrollCourse = (req, res) => {
  Course.findById(req.params.id, (err, course) => {
    if (err || !course) {
      console.log(err);
      req.flash('error', 'Không tìm thấy khóa học');
      res.redirect('/');
    } else {
      Invoice.create(
        {
          user: req.user._id,
          course: course._id,
          fee: course.price - (course.price * course.discount) / 100,
        },
        (err, invoice) => {
          if (err || !invoice) {
            console.log(err);
            req.flash('error', 'Không tìm thấy khóa học');
            res.redirect('/');
          } else {
            req.flash('info', 'Đã tham gia khóa học thành công');
            res.redirect(`/courses/${course._id}`);
          }
        }
      );
    }
  });
};

exports.getLecture = (req, res) => {
  Course.findById(req.params.courseId)
    .populate({
      path: 'sections',
      populate: {
        path: 'lectures',
      },
    })
    .exec((err, course) => {
      if (err || !course) {
        req.flash('error', 'Không thể tải nội dung khóa học');
        res.redirect('/');
      } else {
        course = course.toObject();
        let sectionNo, lectureNo;
        try {
          sectionNo = +req.params.sectionNo;
          lectureNo = +req.params.lectureNo;
        } catch (e) {
          req.flash('error', 'Chỉ số chương hoặc bài học không hợp lệ');
          res.redirect(`/courses${course._id}`);
        }

        if (
          sectionNo < -1 ||
          sectionNo >= course.sections.length ||
          lectureNo < -1 ||
          lectureNo >= course.sections[sectionNo].lectures.length
        ) {
          req.flash('error', 'Chỉ số chương hoặc bài học không hợp lệ');
          res.redirect(`/courses${course._id}`);
        }

        const section = course.sections[sectionNo];

        let nextSectionNo = sectionNo;
        let previousSectionNo = sectionNo;

        let nextLectureNo = lectureNo + 1;
        let previousLectureNo = lectureNo - 1;

        if (nextLectureNo >= section.lectures.length) {
          if (course.sections[sectionNo + 1]) {
            nextSectionNo++;
            nextLectureNo = 0;
          } else {
            nextLectureNo = nextSectionNo = null;
          }
        }

        if (previousLectureNo < 0) {
          if (course.sections[sectionNo - 1]) {
            previousSectionNo--;
            previousLectureNo = course.sections[sectionNo - 1].lectures.length - 1;
          } else {
            previousSectionNo = previousLectureNo = null;
          }
        }

        const lecture = Object.assign({}, section.lectures[lectureNo], {
          sectionNo,
          lectureNo,
          previousSectionNo,
          previousLectureNo,
          nextSectionNo,
          nextLectureNo,
        });
        console.log(lecture);
        res.render('student/lecture', {
          course,
          lecture,
        });
      }
    });
};
