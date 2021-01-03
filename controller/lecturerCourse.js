const mongoose = require('mongoose');
const Course = require('../models/Course');
const Section = require('../models/Section');
const Lecture = require('../models/Lecture');
const SubCategory = require('../models/SubCategory');

exports.getAddNewCourseView = (_req, res) => {
  res.render('lecturer/newCourse');
};

exports.getCourseDetailView = (req, res) => {
  Course.findById(req.params.id)
    .populate('category')
    .exec((err, course) => {
      if (err || !course) {
        req.flash('error', `Không tìm thấy khóa học với id là ${req.params.id}`);
        res.redirect('/lecturer');
      } else {
        res.render('lecturer/courseDetail', { course });
      }
    });
};

exports.getCourseEditorView = (req, res) => {
  Course.findById(req.params.id)
    .populate('category')
    .exec((err, course) => {
      if (err || !course) {
        req.flash('error', `Không tìm thấy khóa học với id là ${req.params.id}`);
        res.redirect('/lecturer');
      } else {
        res.render('lecturer/courseEditor', { course });
      }
    });
};

exports.getSectionsView = (req, res) => {
  Course.findById(req.params.id)
    .populate('sections')
    .exec((err, course) => {
      if (err || !course) {
        req.flash('error', `Không tìm thấy khóa học với id là ${req.params.id}`);
        res.redirect('/lecturer');
      } else {
        res.render('lecturer/courseSections', { course });
      }
    });
};

exports.getSectionView = (req, res) => {
  Section.findById(mongoose.Types.ObjectId(req.params.sectionId))
    .populate('lectures')
    .exec((err, section) => {
      if (err || !section) {
        console.log(err);
        req.flash('error', `Không tìm thấy chương với id là ${req.params.id}`);
        res.redirect(`/lecturer/course/${req.params.courseId}/sections`);
      } else {
        res.render('lecturer/courseSection', { section });
      }
    });
};

exports.addNewCourse = (req, res) => {
  SubCategory.findById(new mongoose.Types.ObjectId(req.body.category), (err, category) => {
    if (err || !category) {
      req.flash('error', 'Không thể thêm khóa học này');
      res.redirect('/lecturer');
    } else {
      Course.create(
        {
          name: req.body.name,
          avatar: req.file.filename,
          category: category._id,
          view: 0,
          description: req.body.description,
          price: req.body.price,
          lecturer: req.user._id,
        },
        (err) => {
          if (err) {
            req.flash('error', 'Không thể thêm khóa học này');
          } else {
            req.flash('info', 'Đã thêm khóa học thành công');
          }
          res.redirect('/lecturer');
        }
      );
    }
  });
};

exports.addNewSection = (req, res) => {
  //Find course by its id and check if its lecturer is current user
  Section.create({ name: req.body.name }, (err, section) => {
    if (err) {
      req.flash('error', 'Không thể thêm chương này');
      return res.redirect(`/lecturer/course/${req.params.id}/sections`);
    }
    Course.updateOne(
      { _id: req.params.id, lecturer: req.user._id },
      {
        $push: {
          sections: section._id,
        },
      },
      (err, course) => {
        if (err || !course) {
          req.flash('error', 'Không thể thêm chương này');
        } else {
          req.flash('info', `Đã thêm chương ${section.name}`);
        }
        res.redirect(`/lecturer/course/${req.params.id}/sections`);
      }
    );
  });
};

exports.addNewLecture = (req, res) => {
  Lecture.create(
    {
      name: req.body.name,
      video: req.file.filename,
    },
    (err, lecture) => {
      if (err) {
        req.flash('error', 'Không thể thêm bài giảng này');
        return res.redirect(`/lecturer/course/${req.params.courseId}/sections/${req.params.sectionId}`);
      }
      Section.updateOne(
        { _id: req.params.sectionId },
        {
          $push: {
            lectures: lecture._id,
          },
        },
        (err) => {
          if (err) {
            req.flash('error', 'Không thể thêm bài giảng này');
          } else {
            req.flash('info', `Đã thêm bài giảng ${lecture.name}`);
          }
          res.redirect(`/lecturer/course/${req.params.courseId}/sections/${req.params.sectionId}`);
        }
      );
    }
  );
};

exports.updateCourse = (req, res) => {
  const updateData = {
    name: req.body.name,
    category: req.body.category,
    price: req.body.price,
    discount: req.body.discount,
    description: req.body.description,
  };
  if (req.file) {
    updateData.avatar = req.file.filename;
  }

  //Find course by its id and check if its lecturer is current user
  Course.updateOne({ _id: req.params.id, lecturer: req.user._id }, updateData, (err, course) => {
    if (err || !course) {
      req.flash('error', 'Không thể chỉnh sửa khóa học này');
    } else {
      req.flash('info', 'Chỉnh sửa khóa học thành công');
    }
    res.redirect(`/lecturer/course/${req.params.id}`);
  });
};

exports.deleteCourse = (req, res) => {
  Course.deleteOne({ _id: req.params.id, lecturer: req.user._id }, (err) => {
    if (err) {
      req.flash('error', 'Không thể xóa khóa học này');
      res.redirect(`/lecturer/course/${req.params.id}`);
    } else {
      req.flash('info', 'Xóa khóa học thành công');
      res.redirect('/lecturer');
    }
  });
};
