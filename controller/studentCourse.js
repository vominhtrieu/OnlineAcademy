const Course = require('../models/Course');
const Invoice = require('../models/Invoice');
const util = require('util');
const mongoose = require('mongoose');
const moment = require('moment');
const User = require('../models/User');
const Record = require('../models/Record');

moment.locale('vi');
const getCourseDetail = util.promisify(Course.getCourseDetail);

exports.getCourseDetail = async (req, res) => {
  try {
    await Course.updateOne({ _id: req.params.id }, { $inc: { viewCount: 1 } });
    const course = await getCourseDetail(new mongoose.Types.ObjectId(req.params.id));
    if (!req.user) {
      res.render('student/courseDetail', { course, moment });
    } else {
      const invoice = await Invoice.findOne({
        user: req.user._id,
        course: course._id,
      });

      const userReview = course.reviews.find((review) => review.writer._id.equals(req.user._id));
      if (userReview) {
        course.reviews = course.reviews.filter((review) => review != userReview);
      }

      const user = await User.findById(req.user._id);
      const isFavorite = Boolean(user.favoriteCourses.find((course) => course.toString() === req.params.id));

      res.render('student/courseDetail', { course, moment, invoice, userReview, isFavorite });
    }
  } catch (e) {
    console.log(e);
    req.flash('error', 'Không tìm thấy khóa học');
    res.redirect('/');
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    await Invoice.create({
      user: req.user._id,
      course: course._id,
      fee: course.price - (course.price * course.discount) / 100,
    });

    await Record.create({
      user: req.user._id,
      course: req.params.id,
    });

    req.flash('info', 'Đã tham gia khóa học thành công');
    res.redirect(`/courses/${course._id}`);
  } catch (e) {
    console.log(e);
    req.flash('error', 'Không tìm thấy khóa học');
    res.redirect('/');
  }
};

exports.getLecture = async (req, res) => {
  try {
    let course = await Course.findById(req.params.courseId)
      .populate({
        path: 'sections',
        populate: {
          path: 'lectures',
        },
      })
      .exec();

    course = course.toObject();
    let sectionNo, lectureNo;
    try {
      sectionNo = +req.params.sectionNo;
      lectureNo = +req.params.lectureNo;
    } catch (e) {
      req.flash('error', 'Chỉ số chương hoặc bài học không hợp lệ');
      return res.redirect(`/courses${course._id}`);
    }
    await Record.updateOne(
      { user: req.user._id, course: req.params.courseId },
      {
        stopAt: {
          section: sectionNo,
          lecture: lectureNo,
        },
      }
    );

    const record = await Record.findOne({ user: req.user._id, course: req.params.courseId });

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

    course.sections.forEach((section) => {
      section.lectures.forEach((lecture) => {
        const item = record.lectures.find((item) => item.lecture.toString() === lecture._id.toString());
        if (item && item.complete > 0.9) lecture.completed = true;
        else lecture.completed = false;
        console.log(lecture);
      });
    });

    res.render('student/lecture', {
      course,
      lecture,
      record: record.lectures.find((item) => lecture._id.toString() === item.lecture.toString()),
    });
  } catch (e) {
    console.log(e);
    req.flash('error', 'Không thể tải nội dung khóa học');
    res.redirect('back');
  }
};

exports.learn = async (req, res) => {
  try {
    let record = await Record.findOne({
      user: req.user._id,
      course: req.params.courseId,
    });

    res.redirect(`/courses/${req.params.courseId}/sections/${record.stopAt.section}/lectures/${record.stopAt.lecture}`);
  } catch (e) {
    console.log(e);
    req.flash('error', 'Đã xảy ra lỗi');
    res.redirect('back');
  }
};

exports.updateRecord = async (req, res) => {
  try {
    const lectureId = req.body.lectureId;
    const complete = +req.body.complete;

    const record = await Record.findOne({
      course: req.params.courseId,
      user: req.user._id,
    });

    record.lectures = record.lectures.filter(({ lecture }) => lecture.toString() != lectureId);
    record.lectures.push({ lecture: lectureId, complete });
    await record.save();

    res.status(200).json('Ok');
  } catch (e) {
    console.log(e);
    res.status(400).json('Not so good');
  }
};
